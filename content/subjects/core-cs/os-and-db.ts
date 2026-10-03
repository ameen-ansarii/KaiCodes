import { Topic } from '../../../types/content';

export const operatingSystemsTopic: Topic = {
  id: 'os-fundamentals',
  subjectId: 'core-cs',
  title: 'Operating Systems & Concurrency',
  description: 'Threads, processes, memory management, and synchronization primitives.',
  icon: 'cpu',
  accentColor: '#FFC800',
  totalLessons: 3,
  completedLessons: 0,
  lessons: [
    {
      id: 'process-vs-thread',
      topicId: 'os-fundamentals',
      subjectId: 'core-cs',
      title: 'Process vs Thread',
      subtitle: 'Understand isolation, memory spaces, and context switching overhead.',
      difficulty: 'Easy',
      estimatedMinutes: 7,
      kaiTip: 'A process is an isolated home with its own address space; threads are family members sharing the same living room.',
      theory: {
        overview: 'A process is an executing program with dedicated virtual memory, file descriptors, and security tokens. A thread is the smallest schedulable unit of CPU execution inside a process.',
        whyItMatters: 'Every backend server, browser tab, and mobile app depends on whether work runs across isolated processes or concurrent threads sharing state.',
        mentalModel: 'Processes cannot step on each other by default because the OS gives them separate private address spaces. Threads within the same process share heap memory, making them fast but vulnerable to race conditions.',
        keyTakeaways: [
          'Processes have independent address spaces (PCB).',
          'Threads in the same process share heap, code, and data, but have their own stack and program counter (TCB).',
          'Process context switches cost more due to TLB (Translation Lookaside Buffer) flushes.'
        ]
      },
      flowchart: {
        title: 'Memory Architecture Comparison',
        caption: 'Separate Process Memory vs Shared Thread Heap',
        steps: [
          {
            stepNumber: 1,
            label: 'Process Boundary',
            explanation: 'OS kernel uses Page Tables to guarantee Process A cannot read or overwrite Process B memory.',
            stateIllustration: {
              type: 'network',
              values: ['Process A (Address Space 1)', 'Kernel MMU Barrier', 'Process B (Address Space 2)']
            }
          },
          {
            stepNumber: 2,
            label: 'Thread Boundary',
            explanation: 'Thread 1 and Thread 2 run inside Process A. Both can read and mutate the shared heap simultaneously.',
            stateIllustration: {
              type: 'network',
              values: ['Thread 1 (Stack 1)', 'Shared Heap Memory', 'Thread 2 (Stack 2)']
            }
          }
        ]
      },
      implementations: [
        {
          language: 'python',
          code: `import threading
import time

counter = 0
lock = threading.Lock()

def worker():
    global counter
    for _ in range(100000):
        with lock:  # Protect shared heap memory from race condition
            counter += 1

t1 = threading.Thread(target=worker)
t2 = threading.Thread(target=worker)
t1.start(); t2.start()
t1.join(); t2.join()
print(f"Final safe counter: {counter}")`,
          explanation: 'Shows two threads sharing the global heap counter, requiring a mutex lock to prevent race conditions.'
        }
      ],
      complexity: {
        time: 'Thread switch is faster than Process switch',
        space: 'Threads share process virtual address space',
        explanation: 'Thread switching preserves CPU memory caches and TLB mappings.'
      },
      checkpoint: {
        id: 'os-check',
        question: 'Which component is uniquely private to each thread and NOT shared with sibling threads?',
        options: [
          'Call stack and program counter (registers)',
          'Global heap memory',
          'Open file descriptors',
          'Process user credentials'
        ],
        correctIndex: 0,
        explanation: 'Each thread needs its own stack and instruction pointer to execute its own function call sequence independently.',
        kaiAcceptedQuote: 'Spot on! Each thread tracks its own call stack.',
        kaiFrustratedQuote: 'Think about what a thread needs to know where it currently is in code.'
      }
    }
  ]
};
