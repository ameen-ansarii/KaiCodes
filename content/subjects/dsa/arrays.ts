import { Topic } from '../../../types/content';

export const arraysTopic: Topic = {
  id: 'arrays-and-hashing',
  subjectId: 'dsa',
  title: 'Arrays and Hashing',
  description: 'Contiguous memory, hash maps, and constant-time lookups.',
  icon: 'layers',
  accentColor: '#7C3AED',
  totalLessons: 4,
  completedLessons: 1,
  lessons: [
    {
      id: 'two-sum',
      topicId: 'arrays-and-hashing',
      subjectId: 'dsa',
      title: 'Two Sum',
      subtitle: 'Find two indices whose values sum up to the target.',
      difficulty: 'Easy',
      estimatedMinutes: 8,
      kaiTip: 'Never use nested loops when a hash map gives you constant-time lookups for the complement.',
      theory: {
        overview: 'Given an array of integers nums and an integer target, find two distinct indices such that nums[i] + nums[j] == target.',
        whyItMatters: 'Two Sum teaches the fundamental engineering tradeoff: using a little extra memory (a hash map) to save massive amounts of CPU time.',
        mentalModel: 'Think of looking for a missing puzzle piece. For every number x you encounter, ask the map: "Have I already seen target - x?"',
        keyTakeaways: [
          'Brute force checks every pair in O(n^2) time.',
          'One pass hash map solves it in O(n) time with O(n) memory.',
          'Map keys store array values, map values store their indices.'
        ]
      },
      flowchart: {
        title: 'One-Pass Hash Map Execution Trace',
        caption: 'Array: [2, 7, 11, 15] with Target = 9',
        steps: [
          {
            stepNumber: 1,
            label: 'Index 0: Inspect 2',
            explanation: 'Target is 9. Needed complement is 9 - 2 = 7. Look up 7 in map. Not found. Store 2 at index 0 in map.',
            stateIllustration: {
              type: 'hashmap',
              primaryPointer: 0,
              values: [2, 7, 11, 15],
              mapState: { '2': 0 }
            }
          },
          {
            stepNumber: 2,
            label: 'Index 1: Inspect 7',
            explanation: 'Target is 9. Needed complement is 9 - 7 = 2. Look up 2 in map. Found at index 0! Return [0, 1].',
            stateIllustration: {
              type: 'hashmap',
              primaryPointer: 1,
              values: [2, 7, 11, 15],
              highlightIndices: [0, 1],
              mapState: { '2': 0 }
            }
          }
        ]
      },
      implementations: [
        {
          language: 'python',
          code: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
          explanation: 'Iterate through the array once. Check if target - num exists in the hash table. If yes, return indices.'
        },
        {
          language: 'typescript',
          code: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (seen.has(diff)) {
      return [seen.get(diff)!, i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
          explanation: 'Uses JavaScript Map for guaranteed O(1) average lookup and insertion time.'
        }
      ],
      complexity: {
        time: 'O(n)',
        space: 'O(n)',
        explanation: 'We traverse the array containing n elements only once. Each lookup in the table costs only O(1) time.'
      },
      checkpoint: {
        id: 'two-sum-check',
        question: 'Why is a hash map faster than checking all pairs with two nested loops?',
        options: [
          'Hash map lookups happen in average O(1) time instead of O(n) scan',
          'Arrays automatically sort numbers when put in a hash map',
          'Hash maps compress the array into half its size',
          'Hash maps run on the GPU directly'
        ],
        correctIndex: 0,
        explanation: 'A hash map computes the memory bucket via hash function in O(1) time, cutting the O(n^2) nested loop down to linear O(n).',
        kaiAcceptedQuote: 'Spot on! Trading space for time is the premier algorithmic win.',
        kaiFrustratedQuote: 'Not quite. The magic is instantaneous O(1) lookup.'
      }
    },
    {
      id: 'contains-duplicate',
      topicId: 'arrays-and-hashing',
      subjectId: 'dsa',
      title: 'Contains Duplicate',
      subtitle: 'Determine if any value appears at least twice in an array.',
      difficulty: 'Easy',
      estimatedMinutes: 6,
      kaiTip: 'A hash set lets you detect previously seen values with a single scan.',
      theory: {
        overview: 'Given an integer array nums, return true if any value appears at least twice, and false if every element is distinct.',
        whyItMatters: 'Teaches duplicate detection and hash set uniqueness constraints.',
        mentalModel: 'Imagine checking names at a VIP door with a clipboard. If the name is already on your clipboard, sound the alarm.',
        keyTakeaways: [
          'Sorting takes O(n log n) time and O(1) extra space.',
          'Hash set takes O(n) time and O(n) space.',
          'Early exit returns true as soon as the first duplicate is encountered.'
        ]
      },
      flowchart: {
        title: 'Set Membership Trace',
        caption: 'Array: [1, 2, 3, 1]',
        steps: [
          {
            stepNumber: 1,
            label: 'Process 1, 2, 3',
            explanation: 'None of these numbers are in the set yet. Add each one to the set.',
            stateIllustration: {
              type: 'hashmap',
              primaryPointer: 2,
              values: [1, 2, 3, 1],
              mapState: { '1': 1, '2': 1, '3': 1 }
            }
          },
          {
            stepNumber: 2,
            label: 'Process final 1',
            explanation: '1 is already in the set! Return true immediately.',
            stateIllustration: {
              type: 'hashmap',
              primaryPointer: 3,
              values: [1, 2, 3, 1],
              highlightIndices: [0, 3],
              mapState: { '1': 1, '2': 1, '3': 1 }
            }
          }
        ]
      },
      implementations: [
        {
          language: 'python',
          code: `def containsDuplicate(nums: list[int]) -> bool:
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
          explanation: 'Maintains a set of observed numbers. Returns True on the first duplicate.'
        }
      ],
      complexity: {
        time: 'O(n)',
        space: 'O(n)',
        explanation: 'We do at most n set insertions and lookups, each costing O(1) average time.'
      },
      checkpoint: {
        id: 'contains-duplicate-check',
        question: 'What is the space complexity if you sort the array in place first instead of using a set?',
        options: [
          'O(1) auxiliary space (depending on sorting implementation)',
          'O(n^2) space',
          'O(log n) time',
          'Zero memory at all times'
        ],
        correctIndex: 0,
        explanation: 'In-place sorting avoids the O(n) hash set, but increases the time complexity from O(n) to O(n log n).',
        kaiAcceptedQuote: 'Clean answer! You understand the space-time trade-off.',
        kaiFrustratedQuote: 'Think about where the extra memory went.'
      }
    }
  ]
};
