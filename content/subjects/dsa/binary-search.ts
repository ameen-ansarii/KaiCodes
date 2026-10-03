import { Topic } from '../../../types/content';

export const binarySearchTopic: Topic = {
  id: 'binary-search',
  subjectId: 'dsa',
  title: 'Binary Search & Bounds',
  description: 'Logarithmic search, sorted range exploration, and search space reduction.',
  icon: 'search',
  accentColor: '#10B981',
  totalLessons: 2,
  completedLessons: 0,
  lessons: [
    {
      id: 'binary-search-basic',
      topicId: 'binary-search',
      subjectId: 'dsa',
      title: 'Binary Search Essentials',
      subtitle: 'Locate an element in a sorted array in O(log n) time.',
      difficulty: 'Easy',
      estimatedMinutes: 6,
      kaiTip: 'Always calculate mid using low + (high - low) // 2 to avoid integer overflow in languages like Java or C++.',
      theory: {
        overview: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.',
        whyItMatters: 'Binary search is the quintessential O(log n) algorithm. Cutting search space in half each iteration scales to billions of items in ~30 operations.',
        mentalModel: 'Looking up a word in a physical dictionary: open to the middle. If the target word comes earlier, discard the entire right half.',
        keyTakeaways: [
          'Array MUST be sorted for binary search to work.',
          'Condition: while (low <= high).',
          'Search space shrinks by 50% on every single step.'
        ]
      },
      flowchart: {
        title: 'Binary Halving Steps',
        caption: 'Array: [-1, 0, 3, 5, 9, 12], Target = 9',
        steps: [
          {
            stepNumber: 1,
            label: 'low = 0, high = 5 -> mid = 2 (value 3)',
            explanation: '3 is less than 9. Target must be in the right half. Set low = mid + 1 = 3.',
            stateIllustration: {
              type: 'pointers',
              primaryPointer: 0,
              secondaryPointer: 5,
              values: [-1, 0, 3, 5, 9, 12]
            }
          },
          {
            stepNumber: 2,
            label: 'low = 3, high = 5 -> mid = 4 (value 9)',
            explanation: 'Value at mid 4 is 9! Target found at index 4. Return 4.',
            stateIllustration: {
              type: 'pointers',
              primaryPointer: 3,
              secondaryPointer: 5,
              highlightIndices: [4],
              values: [-1, 0, 3, 5, 9, 12]
            }
          }
        ]
      },
      implementations: [
        {
          language: 'python',
          code: `def search(nums: list[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
          explanation: 'Standard logarithmic search in Python.'
        },
        {
          language: 'cpp',
          code: `int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
          explanation: 'Safe integer overflow midpoint calculation in C++.'
        },
        {
          language: 'java',
          code: `public int search(int[] nums, int target) {
    int low = 0, high = nums.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
          explanation: 'Canonical binary search implementation in Java.'
        },
        {
          language: 'typescript',
          code: `function search(nums: number[], target: number): number {
  let low = 0;
  let high = nums.length - 1;
  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
          explanation: 'Standard TypeScript binary search.'
        }
      ],
      complexity: {
        time: 'O(log n)',
        space: 'O(1)',
        explanation: 'At each step the problem size is halved. Iterative approach uses O(1) space.'
      },
      checkpoint: {
        id: 'binary-search-check',
        question: 'How many comparisons does binary search take for an array with 1,000,000 items in the worst case?',
        options: [
          'Around 20 comparisons (log2(1,000,000) ≈ 19.93)',
          '500,000 comparisons',
          '1,000,000 comparisons',
          'Exactly 2 comparisons'
        ],
        correctIndex: 0,
        explanation: '2^20 is 1,048,576. Binary search halves the search space at every step, requiring at most 20 comparisons for 1 million sorted items.',
        kaiAcceptedQuote: 'Incredible! That is the astonishing superpower of logarithmic time.',
        kaiFrustratedQuote: 'Recall that binary search cuts the array in half at each step (2^x = 1,000,000).'
      }
    },
    {
      id: 'search-rotated-array',
      topicId: 'binary-search',
      subjectId: 'dsa',
      title: 'Search in Rotated Sorted Array',
      subtitle: 'Find target in an array rotated at an unknown pivot.',
      difficulty: 'Medium',
      estimatedMinutes: 9,
      kaiTip: 'Even in a rotated array, at least one half (left or right) is ALWAYS normally sorted.',
      theory: {
        overview: 'Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.',
        whyItMatters: 'Frequently asked FAANG question testing edge cases and invariant preservation in modified binary search.',
        mentalModel: 'Check nums[low] <= nums[mid]. If true, the left half is clean and sorted. Otherwise, the right half must be clean and sorted.',
        keyTakeaways: [
          'Find which half is monotonically increasing.',
          'Check if target falls within the bounds of that sorted half.',
          'Discard the other half accordingly.'
        ]
      },
      flowchart: {
        title: 'Determining Cleanly Sorted Half',
        caption: 'Array: [4, 5, 6, 7, 0, 1, 2], Target = 0',
        steps: [
          {
            stepNumber: 1,
            label: 'low = 0 (4), high = 6 (2) -> mid = 3 (7)',
            explanation: 'nums[0] (4) <= nums[3] (7), so left half [4, 5, 6, 7] is normally sorted. Does target 0 lie in [4, 7]? No! Therefore search right half. low = mid + 1 = 4.',
            stateIllustration: {
              type: 'pointers',
              primaryPointer: 0,
              secondaryPointer: 6,
              values: [4, 5, 6, 7, 0, 1, 2]
            }
          },
          {
            stepNumber: 2,
            label: 'low = 4 (0), high = 6 (2) -> mid = 4 (0)',
            explanation: 'nums[4] is 0! Target found immediately at index 4.',
            stateIllustration: {
              type: 'pointers',
              primaryPointer: 4,
              secondaryPointer: 6,
              highlightIndices: [4],
              values: [4, 5, 6, 7, 0, 1, 2]
            }
          }
        ]
      },
      implementations: [
        {
          language: 'python',
          code: `def search(nums: list[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        # Check if left half is sorted
        if nums[low] <= nums[mid]:
            if nums[low] <= target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1
        # Otherwise right half is sorted
        else:
            if nums[mid] < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
    return -1`,
          explanation: 'Tests sorted halves to preserve O(log n) guarantees.'
        },
        {
          language: 'cpp',
          code: `int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[low] <= nums[mid]) {
            if (nums[low] <= target && target < nums[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}`,
          explanation: 'Logarithmic search without finding pivot first.'
        },
        {
          language: 'java',
          code: `public int search(int[] nums, int target) {
    int low = 0, high = nums.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[low] <= nums[mid]) {
            if (nums[low] <= target && target < nums[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}`,
          explanation: 'Java single-pass modified binary search.'
        },
        {
          language: 'typescript',
          code: `function search(nums: number[], target: number): number {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[low] <= nums[mid]) {
      if (nums[low] <= target && target < nums[mid]) high = mid - 1;
      else low = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[high]) low = mid + 1;
      else high = mid - 1;
    }
  }
  return -1;
}`,
          explanation: 'Optimal TypeScript implementation.'
        }
      ],
      complexity: {
        time: 'O(log n)',
        space: 'O(1)',
        explanation: 'We still halve the search space at every step, preserving pure logarithmic time complexity.'
      },
      checkpoint: {
        id: 'search-rotated-check',
        question: 'How do you determine if the left half [low ... mid] is cleanly sorted?',
        options: [
          'Check if nums[low] <= nums[mid]',
          'Check if nums[low] == 0',
          'Calculate the average of low and high',
          'Check if nums[mid] is an even number'
        ],
        correctIndex: 0,
        explanation: 'In a rotated sorted array without duplicates, if nums[low] <= nums[mid], no pivot exists between low and mid, meaning that entire left portion is monotonically sorted.',
        kaiAcceptedQuote: 'Perfect! That is the core invariant of rotated array search.',
        kaiFrustratedQuote: 'Compare the boundaries of the left sub-array.'
      }
    }
  ]
};
