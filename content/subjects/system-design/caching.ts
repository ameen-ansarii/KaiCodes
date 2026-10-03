import { Topic } from '../../../types/content';

export const cachingTopic: Topic = {
  id: 'system-caching',
  subjectId: 'system-design',
  title: 'Caching & Distributed Systems',
  description: 'In-memory stores, eviction policies, and cache invalidation patterns.',
  icon: 'database',
  accentColor: '#0284C7',
  totalLessons: 3,
  completedLessons: 0,
  lessons: [
    {
      id: 'cache-aside-pattern',
      topicId: 'system-caching',
      subjectId: 'system-design',
      title: 'Cache-Aside Pattern',
      subtitle: 'The gold standard pattern for scalable read-heavy web architectures.',
      difficulty: 'Medium',
      estimatedMinutes: 10,
      kaiTip: 'Read from the cache first; on a miss, read the database and write the missing value back into the cache.',
      theory: {
        overview: 'Cache-Aside (also known as Lazy Loading) places the application in charge of coordinating reads and writes between the cache layer (Redis or Memcached) and the persistent database.',
        whyItMatters: '95% of real-world production web services are read-heavy. Without cache-aside, your relational database would collapse under high request volumes.',
        mentalModel: 'Think of keeping sticky notes on your monitor for phone numbers you call every 5 minutes, rather than opening your filing cabinet every single time.',
        keyTakeaways: [
          'App queries Redis first. If found (Cache Hit), return immediately.',
          'If not found (Cache Miss), query PostgreSQL, save into Redis with TTL, return to user.',
          'Always set a Time-To-Live (TTL) to prevent stale data from lingering permanently.'
        ]
      },
      flowchart: {
        title: 'Cache-Aside Request Lifecycle',
        caption: 'Flow between Client, Application Server, Redis, and Database',
        steps: [
          {
            stepNumber: 1,
            label: 'Step 1: Check Cache',
            explanation: 'Application checks Redis for key "user:123". Cache returns nil (Cache Miss).',
            stateIllustration: {
              type: 'network',
              values: ['Client', 'App Server', 'Redis (Miss)', 'PostgreSQL']
            }
          },
          {
            stepNumber: 2,
            label: 'Step 2: Database Read & Backfill',
            explanation: 'App reads user from PostgreSQL, writes to Redis with TTL of 3600s, and delivers response to client.',
            stateIllustration: {
              type: 'network',
              values: ['Client', 'App Server', 'Redis (Populated)', 'PostgreSQL (Queried)']
            }
          }
        ]
      },
      implementations: [
        {
          language: 'typescript',
          code: `async function getUser(userId: string): Promise<User> {
  const cacheKey = \`user:\${userId}\`;
  
  // 1. Try reading from cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. Cache miss: read from DB
  const user = await db.users.findById(userId);
  if (user) {
    // 3. Backfill cache with 1 hour expiration
    await redis.set(cacheKey, JSON.stringify(user), 'EX', 3600);
  }

  return user;
}`,
          explanation: 'Demonstrates Cache-Aside with Redis in TypeScript, including JSON serialization and explicit TTL.'
        }
      ],
      complexity: {
        time: 'O(1) on cache hit, O(DB query) on cache miss',
        space: 'Memory proportional to hot keys in RAM',
        explanation: 'In-memory Redis lookups complete in sub-millisecond time compared to 10-50ms database disk queries.'
      },
      checkpoint: {
        id: 'caching-check',
        question: 'What is the main danger of omitting a TTL (Time-To-Live) on cached entries?',
        options: [
          'Stale data remains in the cache indefinitely after database updates',
          'Redis will automatically turn off',
          'Database disk size will increase by 10x',
          'All web connections will be rejected immediately'
        ],
        correctIndex: 0,
        explanation: 'Without a TTL or active cache invalidation hook, updates in the database will never reflect in the cache, serving outdated records.',
        kaiAcceptedQuote: 'Accurate! Cache invalidation is one of the classic hard problems in CS.',
        kaiFrustratedQuote: 'Consider what happens when a user updates their profile in the database.'
      }
    }
  ]
};
