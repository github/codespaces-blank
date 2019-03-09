/*
 * @lc app=leetcode id=167 lang=java
 *
 * [167] Two Sum II - Input array is sorted
 *
 * https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/
 *
 * algorithms
 * Easy (49.21%)
 * Total Accepted:    215.9K
 * Total Submissions: 436.8K
 * Testcase Example:  '[2,7,11,15]\n9'
 *
 * Given an array of integers that is already sorted in ascending order, find
 * two numbers such that they add up to a specific target number.
 * 
 * The function twoSum should return indices of the two numbers such that they
 * add up to the target, where index1 must be less than index2.
 * 
 * Note:
 * 
 * 
 * Your returned answers (both index1 and index2) are not zero-based.
 * You may assume that each input would have exactly one solution and you may
 * not use the same element twice.
 * 
 * 
 * Example:
 * 
 * 
 * Input: numbers = [2,7,11,15], target = 9
 * Output: [1,2]
 * Explanation: The sum of 2 and 7 is 9. Therefore index1 = 1, index2 = 2.
 * 
 */

 // two pointers
 // O(n) runtime, O(1) space
// class Solution {
//     public int[] twoSum(int[] numbers, int target) {
//         if (numbers == null || numbers.length < 2) {
//             return new int[]{};
//         }
//         int left = 0;
//         int right = numbers.length - 1;
//         while (left < right) {
//             int sum = numbers[left] + numbers[right];
//             if (sum == target) {
//                 return new int[]{left + 1, right + 1};
//             } else if (sum > target) {
//                 right--;
//             } else {
//                 left++;
//             }
//         }
//         return new int[]{};
//     }
// }

// Binary Search
// O(nlogn) rumtime, O(1) space
class Solution {
    public int[] twoSum(int[] numbers, int target) {
        for (int i = 0; i < numbers.length; i++) {
            int result = binarySearch(numbers, target - numbers[i], i + 1);
            if (result != -1) {
                return new int[]{i + 1, result + 1};
            }
        }
        return new int[]{};
    }

    private int binarySearch(int[] numbers, int key, int start) {
        int left = start;
        int right = numbers.length - 1;
        while (left < right) {
            int middle = (right + left) / 2;
            if (numbers[middle] < key) {
                left = middle + 1;
            } else {
                right = middle;
            }
        }
        return (left == right && numbers[left] == key) ? left : -1;
    }
}

