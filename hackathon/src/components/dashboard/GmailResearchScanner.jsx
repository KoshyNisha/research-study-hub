import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Search, LoaderCircle, Link as LinkIcon, DollarSign, CalendarClock } from 'lucide-react';

const GMAIL_QUERY = 'newer_than:365d ("paid study" OR "paid research" OR stipend OR compensation OR "gift card" OR "research opportunity" OR "participant needed")';
const MAX_MESSAGES = 40;
const DETAIL_BATCH_SIZE = 5;
const BATCH_PAUSE_MS = 200;
const MAX_RETRIES = 4;
const GOOGLE_SCRIPT_ID = 'google-identity-services';

const RESEARCH_KEYWORDS = ['research', 'study', 'participant', 'experiment', 'survey', 'lab', 'recruiting', 'trial'];
const PAID_KEYWORDS = ['paid', 'compensation', 'stipend', 'gift card', 'earn', 'venmo', 'cash', 'incentive', 'paid research', 'paid study'];
const SIGNUP_HINTS = ['signup', 'sign up', 'register', 'qualtrics', 'google forms', 'forms.gle', 'apply', 'schedule'];

const GmailResearchScanner = ({ onMarkSignedUp }) => {
  const clientId = useMemo(() => import.meta.env.VITE_GOOGLE_CLIENT_ID || '', []);

  const [authReady, setAuthReady] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('Searching for research opportunity emails...');
  const [error, setError] = useState('');
  const [studies, setStudies] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [pendingConfirmationStudy, setPendingConfirmationStudy] = useState(null);

  const filters = ['all', 'engineering', 'robotics', 'hci', 'remote'];

  useEffect(() => {
    if (!clientId) {
      return;
    }

    const setupTokenClient = () => {
      if (!window.google?.accounts?.oauth2) {
        return;
      }

      const instance = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/gmail.readonly',
        callback: async (response) => {
          if (response.error) {
            setError(`Google auth failed: ${response.error}`);
            setIsScanning(false);
            return;
          }

          const token = response.access_token;
          setAccessToken(token);
          await runScan(token);
        }
      });

      setTokenClient(instance);
      setAuthReady(true);
    };

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      setupTokenClient();
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = setupTokenClient;
    script.onerror = () => setError('Failed to load Google Identity script.');
    document.body.appendChild(script);
  }, [clientId]);

  const filteredStudies = studies.filter((study) => {
    const matchesFilter = activeFilter === 'all' || study.tags.includes(activeFilter);
    const q = searchText.toLowerCase();
    const matchesSearch = !q || study.title.toLowerCase().includes(q) || study.lab.toLowerCase().includes(q) || study.tags.some((tag) => tag.includes(q));
    return matchesFilter && matchesSearch;
  });

  const totalEarnings = studies.reduce((sum, study) => sum + (study.compensationValue || 0), 0);
  const closingSoonCount = studies.filter((study) => study.closingSoon).length;

  const startScan = () => {
    setError('');

    if (!clientId) {
      setError('Set VITE_GOOGLE_CLIENT_ID in your env before connecting Gmail.');
      return;
    }

    if (!tokenClient) {
      setError('Google auth is not ready yet.');
      return;
    }

    setIsScanning(true);
    setProgress(10);
    setScanStatus('Requesting Gmail permission...');
    tokenClient.requestAccessToken({ prompt: accessToken ? '' : 'consent' });
  };

  const runScan = async (token) => {
    try {
      setIsScanning(true);
      setProgress(25);
      setScanStatus('Finding likely paid research emails...');

      const listRes = await gmailGet(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(GMAIL_QUERY)}&maxResults=${MAX_MESSAGES}`,
        token
      );

      const ids = (listRes.messages || []).map((m) => m.id);
      if (!ids.length) {
        setStudies([]);
        setProgress(100);
        setScanStatus('No matching paid research emails found.');
        return;
      }

      setProgress(55);
      setScanStatus('Reading matching email content...');

      const details = [];
      for (let index = 0; index < ids.length; index += DETAIL_BATCH_SIZE) {
        const batch = ids.slice(index, index + DETAIL_BATCH_SIZE);
        const batchDetails = await Promise.all(
          batch.map((id) => gmailGet(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`, token))
        );
        details.push(...batchDetails);

        if (index + DETAIL_BATCH_SIZE < ids.length) {
          await sleep(BATCH_PAUSE_MS);
        }
      }

      setProgress(80);
      setScanStatus('Extracting compensation, signup links, and deadlines...');

      const parsed = details
        .map((email, idx) => parseMessageToStudy(email, idx + 1))
        .filter(Boolean);
      const freshStudies = parsed.filter((study) => !isDeadlineExpired(study.deadline));

      setStudies(freshStudies);
      setProgress(100);
      setScanStatus(`Done. Found ${freshStudies.length} opportunities.`);
    } catch (scanError) {
      setError(scanError.message || 'Unable to scan Gmail right now.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleOpenSignup = (study) => {
    if (study.signupUrl) {
      window.open(study.signupUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('No signup link found in this email.');
    }
    setPendingConfirmationStudy(study);
  };

  const handleSignedUpConfirm = () => {
    if (pendingConfirmationStudy && onMarkSignedUp) {
      onMarkSignedUp(pendingConfirmationStudy);
    }
    setPendingConfirmationStudy(null);
  };

  const handleSignedUpCancel = () => {
    setPendingConfirmationStudy(null);
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#00274C]">Gmail Paid Research Scanner</h2>
          <p className="text-sm text-gray-600">Scan your inbox for paid study opportunities with signup links and compensation.</p>
        </div>
        <button
          onClick={startScan}
          disabled={!authReady || isScanning}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00274C] text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#001a36] transition-colors"
        >
          <Mail className="w-4 h-4" />
          {isScanning ? 'Scanning...' : 'Connect Gmail'}
        </button>
      </div>

      {!clientId && (
        <div className="px-6 py-4 bg-amber-50 text-amber-900 text-sm border-b border-amber-200">
          Missing config: set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>hackathon/.env</code>.
        </div>
      )}

      {error && (
        <div className="px-6 py-4 bg-red-50 text-red-700 text-sm border-b border-red-200">
          {error}
        </div>
      )}

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Studies found" value={studies.length} />
          <StatCard label="Total potential earnings" value={formatCurrency(totalEarnings)} />
          <StatCard label="Closing soon" value={closingSoonCount} />
        </div>

        {isScanning && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <LoaderCircle className="w-4 h-4 animate-spin" />
              {scanStatus}
            </div>
            <div className="mt-3 h-2 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full bg-[#00274C] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search studies"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00274C]/20"
            />
          </div>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                activeFilter === filter
                  ? 'bg-[#00274C] text-white border-[#00274C]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[#00274C]'
              }`}
            >
              {capitalize(filter)}
            </button>
          ))}
        </div>

        {filteredStudies.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
            No opportunities match your current filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredStudies.map((study) => (
              <article key={study.id} className="border border-gray-200 rounded-xl p-4 hover:border-[#FFCB05] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-[#00274C]">{study.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{study.lab}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <DollarSign className="w-3 h-3" />
                    {study.compensation}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <CalendarClock className="w-3.5 h-3.5" />
                    Deadline: {study.deadline}
                  </span>
                  <span>{study.format}</span>
                  <span>{study.time}</span>
                </div>

                <p className="mt-3 text-sm text-gray-700 line-clamp-2">{study.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {study.tags.map((tag) => (
                    <span key={`${study.id}-${tag}`} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenSignup(study)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00274C] text-white text-xs font-medium hover:bg-[#001a36]"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    Open Signup
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {pendingConfirmationStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-md rounded-xl bg-white border border-gray-200 shadow-xl p-5">
            <h3 className="text-lg font-semibold text-[#00274C]">Did you sign up?</h3>
            <p className="mt-2 text-sm text-gray-600">
              If you completed signup for <span className="font-medium text-gray-800">{pendingConfirmationStudy.title}</span>,
              we can add it to your applications tracker.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={handleSignedUpCancel}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
              >
                Not yet
              </button>
              <button
                onClick={handleSignedUpConfirm}
                className="px-3 py-1.5 rounded-lg bg-[#00274C] text-white text-sm font-medium hover:bg-[#001a36]"
              >
                Yes, add to applications
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-2xl font-semibold text-[#00274C] mt-1">{value}</p>
  </div>
);

function capitalize(value) {
  if (!value) return value;
  return value[0].toUpperCase() + value.slice(1);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Number(amount) || 0);
}

async function gmailGet(url, token) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    let body = null;
    if (!res.ok) {
      try {
        body = await res.json();
      } catch {
        body = null;
      }

      const reasonList = body?.error?.errors || [];
      const message = body?.error?.message || `HTTP ${res.status}`;
      const retryable = res.status === 429 ||
        reasonList.some((reasonObj) => ['rateLimitExceeded', 'userRateLimitExceeded'].includes(reasonObj.reason)) ||
        /too many concurrent requests for user/i.test(message);

      if (retryable && attempt < MAX_RETRIES) {
        const backoffMs = 400 * (2 ** attempt);
        await sleep(backoffMs);
        continue;
      }

      throw new Error(`Gmail API error: ${message}`);
    }

    return res.json();
  }
  throw new Error('Gmail API error: Request failed after retries.');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseMessageToStudy(email, id) {
  const headers = email.payload?.headers || [];
  const subject = headerValue(headers, 'Subject') || 'Research opportunity';
  const from = headerValue(headers, 'From') || 'Unknown sender';
  const bodyText = extractBodyText(email.payload);
  const combined = `${subject}\n${email.snippet || ''}\n${bodyText}`;
  const lower = combined.toLowerCase();

  const hasResearch = containsAny(lower, RESEARCH_KEYWORDS);
  const hasPaidTerms = containsAny(lower, PAID_KEYWORDS);
  const compensationInfo = extractCompensation(combined);
  const links = extractLinks(combined);
  const signupUrl = links.find((url) => hasSignupHint(url.toLowerCase())) || links[0] || '';

  if (!hasResearch || (!hasPaidTerms && !compensationInfo.label && !signupUrl)) {
    return null;
  }

  const format = inferFormat(lower);
  const tags = inferTags(lower, format);
  const time = extractDuration(combined) || 'Varies';
  const deadline = extractDeadline(combined) || 'Not listed';

  return {
    id,
    title: subject,
    lab: from,
    compensation: compensationInfo.label || 'Compensation not listed',
    compensationValue: compensationInfo.value,
    time,
    format,
    deadline,
    description: (email.snippet || bodyText || 'Open email for full details.').trim().slice(0, 220),
    signupUrl,
    tags,
    closingSoon: deadlineIsSoon(deadline)
  };
}

function headerValue(headers, name) {
  const found = headers.find((h) => h.name?.toLowerCase() === name.toLowerCase());
  return found ? found.value : '';
}

function extractBodyText(payload) {
  if (!payload) return '';

  if (payload.parts && payload.parts.length) {
    return payload.parts.map((part) => extractBodyText(part)).join('\n');
  }

  if (!payload.body?.data) return '';

  try {
    return decodeBase64Url(payload.body.data);
  } catch {
    return '';
  }
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
  return atob(padded);
}

function containsAny(text, words) {
  return words.some((word) => text.includes(word));
}

function extractCompensation(text) {
  const moneyMatches = text.match(/\$\s?\d+(?:\.\d{1,2})?/g) || [];
  const values = moneyMatches
    .map((raw) => Number(raw.replace(/[^\d.]/g, '')))
    .filter((number) => Number.isFinite(number));

  if (!values.length) {
    return { label: '', value: 0 };
  }

  const maxValue = Math.max(...values);
  return {
    label: `$${maxValue}`,
    value: maxValue
  };
}

function extractLinks(text) {
  const matches = text.match(/https?:\/\/[^\s"'<>]+/g) || [];
  return [...new Set(matches.map((url) => url.replace(/[),.]$/, '')))].slice(0, 10);
}

function hasSignupHint(urlText) {
  return SIGNUP_HINTS.some((hint) => urlText.includes(hint));
}

function inferFormat(text) {
  if (text.includes('zoom') || text.includes('remote') || text.includes('online')) return 'Remote';
  if (text.includes('in-person') || text.includes('on campus') || text.includes('north campus')) return 'In-person';
  return 'Unknown';
}

function inferTags(text, format) {
  const tags = [];
  if (format === 'Remote') tags.push('remote');
  if (text.includes('robot') || text.includes('robotics')) tags.push('robotics');
  if (text.includes('hci') || text.includes('usability')) tags.push('hci');
  if (text.includes('engineering') || text.includes('eecs')) tags.push('engineering');
  if (!tags.includes('engineering')) tags.push('engineering');
  return tags;
}

function extractDuration(text) {
  const match = text.match(/\b(\d{1,3})\s?(min|mins|minute|minutes|hour|hours)\b/i);
  if (!match) return '';
  return `${match[1]} ${match[2].toLowerCase()}`;
}

function extractDeadline(text) {
  const patterns = [
    /deadline[:\s]+([A-Za-z]{3,9}\s+\d{1,2}(?:,\s*\d{4})?)/i,
    /by\s+([A-Za-z]{3,9}\s+\d{1,2}(?:,\s*\d{4})?)/i,
    /before\s+([A-Za-z]{3,9}\s+\d{1,2}(?:,\s*\d{4})?)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) return match[1].trim();
  }

  return '';
}

function deadlineIsSoon(deadlineText) {
  const parsed = Date.parse(deadlineText);
  if (!parsed) return false;

  const diffDays = (parsed - Date.now()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 7;
}

function isDeadlineExpired(deadlineText) {
  const parsed = Date.parse(deadlineText);
  if (!parsed) return false;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return parsed < todayStart.getTime();
}

export default GmailResearchScanner;
