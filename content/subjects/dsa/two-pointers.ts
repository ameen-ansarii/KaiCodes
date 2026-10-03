import { Topic } from '../../../types/content';

export const twoPointersTopic: Topic = {
  id: 'two-pointers',
  subjectId: 'dsa',
  title: 'Two Pointers Technique',
  description: 'Shrinking windows, opposite ends, and fast/slow pointer algorithms.',
  icon: 'move',
  accentColor: '#3B82F6',
  totalLessons: 3,
  completedLessons: 0,
  lessons: [
    {
      id: 'two-sum-sorted',
      topicId: 'two-pointers',
      subjectId: 'dsa',
      title: 'Two Sum II (Sorted Array)',
      subtitle: 'Find two numbers adding to target using inward pointers.',
      difficulty: 'Easy',
      estimatedMinutes: 7,
      kaiTip: 'Because the array is already sorted, you do not need hash table memory. Pinch from both ends.',
      theory: {
        overview: 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.',
        whyItMatters: 'Demonstrates how sorting eliminates the need for hash map memory, reducing space complexity to O(1).',
        mentalModel: 'Start with hands on both ends. If the sum is too small, move your left hand right. If the sum is too big, move your right hand left.',
        keyTakeaways: [
          'Left pointer starts at 0, right pointer starts at n - 1.',
          'If sum < target: left++ (need a bigger number).',
          'If sum > target: right-- (need a smaller number).',
          'Runs in O(n) time and O(1) auxiliary space.'
        ]
      },
      flowchart: {
        title: 'Two Pointer Inward Movement',
        caption: 'Array: [2, 7, 11, 15], Target = 13',
        steps: [
          {
            stepNumber: 1,
            label: 'Initial: left = 0 (2), right = 3 (15)',
            explanation: 'Sum = 2 + 15 = 17. 17 > 13 (target). Decrement right pointer to 2.',
            stateIllustration: {
              type: 'pointers',
              primaryPointer: 0,
              secondaryPointer: 3,
              values: [2, 7, 11, 15]
            }
          },
          {
            stepNumber: 2,
            label: 'Next: left = 0 (2), right = 2 (11)',
            explanation: 'Sum = 2 + 11 = 13. Exactly matches target! Return indices [1, 3] (1-indexed).',
            stateIllustration: {
              type: 'pointers',
              primaryPointer: 0,
              secondaryPointer: 2,
              highlightIndices: [0, 2],
              values: [2, 7, 11, 15]
            }
          }
        ]
      },
      implementations: [
        {
          language: 'python',
          code: `def twoSum(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        curr_sum = numbers[left] + numbers[right]
        if curr_sum == target:
            return [left + 1, right + 1]
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
          explanation: 'Iterates inwards from both ends until sum matches target.'
        },
        {
          language: 'cpp',
          code: `vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0, right = numbers.size() - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return {left + 1, right + 1};
        if (sum < target) left++;
        else right--;
    }
    return {};
}`,
          explanation: 'Zero allocations, executes with strict O(1) space.'
        },
        {
          language: 'java',
          code: `public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return new int[]{left + 1, right + 1};
        if (sum < target) left++;
        else right--;
    }
    return new int[]{};
}`,
          explanation: 'Standard two-pointer search on a sorted integer primitive array.'
        },
        {
          language: 'typescript',
          code: `function twoSum(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
          explanation: 'JavaScript/TypeScript clean two pointer solution.'
        }
      ],
      complexity: {
        time: 'O(n)',
        space: 'O(1)',
        explanation: 'Each step moves at least one pointer closer, visiting each element at most once with no additional memory.'
      },
      checkpoint: {
        id: 'two-sum-sorted-check',
        question: 'Why can we safely move the right pointer left when sum > target?',
        options: [
          'Because the left pointer value cannot pair with any larger right value to reach target',
          'Because the array automatically removes larger values',
          'Because right pointer values are always negative',
          'It is just a random guess that happens to work'
        ],
        correctIndex: 0,
        explanation: 'Since the array is sorted, any element to the right would produce an even larger sum with numbers[left]. Therefore, the current right number cannot be part of the solution.',
        kaiAcceptedQuote: 'Brilliant deduction! The monotonicity of sorted arrays makes this guaranteed.',
        kaiFrustratedQuote: 'Think about what happens if you paired numbers[left] with any element further to the right.'
      }
    },
    {
      id: 'valid-palindrome',
      topicId: 'two-pointers',
      subjectId: 'dsa',
      title: 'Valid Palindrome',
      subtitle: 'Determine if a string reads the same backwards ignoring non-letters.',
      difficulty: 'Easy',
      estimatedMinutes: 6,
      kaiTip: 'Skip non-alphanumeric characters on the fly to keep your space O(1).',
      theory: {
        overview: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
        whyItMatters: 'Demonstrates in-place string processing without creating new filtered string buffers.',
        mentalModel: 'Two eyes scanning inward from both sides of the word, skipping punctuation like commas or spaces.',
        keyTakeaways: [
          'Skip non-alphanumeric characters from both ends.',
          'Compare lowercase equivalents of characters.',
          'Early exit with false if any pair does not match.'
        ]
      },
      flowchart: {
        title: 'Skipping & Character Matching',
        caption: 'String: "A man, a plan, a canal: Panama"',
        steps: [
          {
            stepNumber: 1,
            label: 'Start at outer edges',
            explanation: 'left points to "A", right points to "a". Both lowercase to "a". Match! Move both inward.',
            stateIllustration: {
              type: 'pointers',
              primaryPointer: 0,
              secondaryPointer: 29
            }
          },
          {
            stepNumber: 2,
            label: 'Skip spaces and punctuation',
            explanation: 'When pointing to space or comma, advance left or retreat right without comparing.',
            stateIllustration: {
              type: 'pointers',
              primaryPointer: 2,
              secondaryPointer: 27
            }
          }
        ]
      },
      implementations: [
        {
          language: 'python',
          code: `def isPalindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`,
          explanation: 'Traverses inward with helper check for alphanumeric characters.'
        },
        {
          language: 'cpp',
          code: `bool isPalindrome(string s) {
    int left = 0, right = s.size() - 1;
    while (left < right) {
        while (left < right && !isalnum(s[left])) left++;
        while (left < right && !isalnum(s[right])) right--;
        if (tolower(s[left]) != tolower(s[right])) return false;
        left++;
        right--;
    }
    return true;
}`,
          explanation: 'Uses std::isalnum and std::tolower for zero-overhead character checking.'
        },
        {
          language: 'java',
          code: `public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) return false;
        left++;
        right--;
    }
    return true;
}`,
          explanation: 'In-place character scan without regex overhead.'
        },
        {
          language: 'typescript',
          code: `function isPalindrome(s: string): boolean {
  let left = 0, right = s.length - 1;
  const isAlnum = (ch: string) => /[a-zA-Z0-9]/.test(ch);
  while (left < right) {
    while (left < right && !isAlnum(s[left])) left++;
    while (left < right && !isAlnum(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}`,
          explanation: 'Two pointers with O(1) auxiliary space.'
        }
      ],
      complexity: {
        time: 'O(n)',
        space: 'O(1)',
        explanation: 'We traverse the string of length n once with two pointers and use no auxiliary arrays.'
      },
      checkpoint: {
        id: 'valid-palindrome-check',
        question: 'Why is the two-pointer approach better than reversing the filtered string?',
        options: [
          'It takes O(1) space instead of O(n) space to store the reversed string',
          'It changes the time complexity from O(n) to O(1)',
          'Reversing strings in programming is deprecated',
          'Two pointers automatically translate strings into binary'
        ],
        correctIndex: 0,
        explanation: 'Reversing a filtered string requires allocating O(n) heap memory for a new string buffer. Two pointers achieve the exact same check in-place with O(1) memory.',
        kaiAcceptedQuote: '100%! Always remember memory allocation on hot paths matters.',
        kaiFrustratedQuote: 'Think about how much memory a reversed copy of a 10MB string consumes.'
      }
    },
    {
      id: 'container-water',
      topicId: 'two-pointers',
      subjectId: 'dsa',
      title: 'Container With Most Water',
      subtitle: 'Maximize the area of water trapped between vertical lines.',
      difficulty: 'Medium',
      estimatedMinutes: 9,
      kaiTip: 'The area is constrained by the shorter wall. Always move the shorter wall inward.',
      theory: {
        overview: 'Given n non-negative integers representing heights of vertical lines, find two lines that together with the x-axis form a container containing the most water.',
        whyItMatters: 'A core interview classic demonstrating greedy logic combined with two pointers.',
        mentalModel: 'Area = (right - left) * min(height[left], height[right]). Moving the taller wall can never increase area because width shrinks and height is still limited by the short wall.',
        keyTakeaways: [
          'Width always decreases with each step.',
          'To have any chance of finding a bigger area, you MUST find a taller wall.',
          'Therefore, advance the pointer of the shorter wall.'
        ]
      },
      flowchart: {
        title: 'Greedy Height Exploration',
        caption: 'Heights: [1, 8, 6, 2, 5, 4, 8, 3, 7]',
        steps: [
          {
            stepNumber: 1,
            label: 'Inspect width = 8, heights: 1 & 7',
            explanation: 'Area = 8 * min(1, 7) = 8. Height 1 is shorter than 7. Move left pointer to index 1.',
            stateIllustration: {
              type: 'pointers',
              primaryPointer: 0,
              secondaryPointer: 8,
              values: [1, 8, 6, 2, 5, 4, 8, 3, 7]
            }
          },
          {
            stepNumber: 2,
            label: 'Inspect width = 7, heights: 8 & 7',
            explanation: 'Area = 7 * min(8, 7) = 49. New maximum area! Height 7 is shorter than 8. Move right pointer to index 7.',
            stateIllustration: {
              type: 'pointers',
              primaryPointer: 1,
              secondaryPointer: 8,
              highlightIndices: [1, 8],
              values: [1, 8, 6, 2, 5, 4, 8, 3, 7]
            }
          }
        ]
      },
      implementations: [
        {
          language: 'python',
          code: `def maxArea(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_area = 0
    while left < right:
        h = min(height[left], height[right])
        max_area = max(max_area, h * (right - left))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_area`,
          explanation: 'Greedily discards the shorter boundary at each step.'
        },
        {
          language: 'cpp',
          code: `int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int max_area = 0;
    while (left < right) {
        int h = min(height[left], height[right]);
        max_area = max(max_area, h * (right - left));
        if (height[left] < height[right]) left++;
        else right--;
    }
    return max_area;
}`,
          explanation: 'O(n) time, O(1) space with C++ fast vector indexing.'
        },
        {
          language: 'java',
          code: `public int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxArea = 0;
    while (left < right) {
        int h = Math.min(height[left], height[right]);
        maxArea = Math.max(maxArea, h * (right - left));
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxArea;
}`,
          explanation: 'Single-pass optimal solution in Java.'
        },
        {
          language: 'typescript',
          code: `function maxArea(height: number[]): number {
  let left = 0, right = height.length - 1;
  let maxArea = 0;
  while (left < right) {
    const h = Math.min(height[left], height[right]);
    maxArea = Math.max(maxArea, h * (right - left));
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxArea;
}`,
          explanation: 'Clean TypeScript implementation.'
        }
      ],
      complexity: {
        time: 'O(n)',
        space: 'O(1)',
        explanation: 'Each iteration moves either the left or right pointer by 1, resulting in exactly n steps.'
      },
      checkpoint: {
        id: 'container-water-check',
        question: 'Why would moving the taller bar never result in a larger area?',
        options: [
          'Because the width would decrease while the bottleneck height remains capped by the shorter bar',
          'Because the taller bar automatically breaks the array',
          'Because the shorter bar always turns into zero',
          'Because water cannot touch taller bars'
        ],
        correctIndex: 0,
        explanation: 'The height of water is bounded by min(h[left], h[right]). If you move the taller wall, width decreases by 1, but the height is still at most the shorter wall. Area can only stay the same or decrease.',
        kaiAcceptedQuote: 'Spot on! That is the core mathematical proof behind this algorithm.',
        kaiFrustratedQuote: 'Think about the formula: Area = Width * min(h1, h2).'
      }
    }
  ]
};
