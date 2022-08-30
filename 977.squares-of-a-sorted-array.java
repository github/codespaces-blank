/*
 * @lc app=leetcode id=977 lang=java
 *
 * [977] Squares of a Sorted Array
 *
 * https://leetcode.com/problems/squares-of-a-sorted-array/description/
 *
 * algorithms
 * Easy (72.04%)
 * Likes:    353
 * Dislikes: 45
 * Total Accepted:    81.1K
 * Total Submissions: 112.6K
 * Testcase Example:  '[-4,-1,0,3,10]'
 *
 * Given an array of integers A sorted in non-decreasing order, return an array
 * of the squares of each number, also in sorted non-decreasing order.
 * 
 * 
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: [-4,-1,0,3,10]
 * Output: [0,1,9,16,100]
 * 
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: [-7,-3,2,3,11]
 * Output: [4,9,9,49,121]
 * 
 * 
 * 
 * 
 * Note:
 * 
 * 
 * 1 <= A.length <= 10000
 * -10000 <= A[i] <= 10000
 * A is sorted in non-decreasing order.
 * 
 * 
 * 
 */

 // Two pointers
 // Traverse from right to left and put value into a new array
class Solution {
    public int[] sortedSquares(int[] A) {
        if (A == null) {
            return A;
        }

        int left = 0;
        int right = A.length - 1;
        int[] result = new int[A.length];
        for (int i = A.length - 1; i >= 0; i--) {
            if (Math.abs(A[left]) > Math.abs(A[right])) {
                result[i] = A[left] * A[left];
                left++;
            } else {
                result[i] = A[right] * A[right];
                right--;
            }
        }
        return result;
    }
}

class Solution {
    public int[] sortedSquares(int[] nums) {
        int[] results = new int[nums.length];

        // use two pointers to sort the array by Math.abs(value)
        // get the square and put to the results array
        int left = 0, right = nums.length - 1, index = nums.length - 1;
        while (left <= right) {
        if (Math.abs(nums[left]) >= Math.abs(nums[right])) {
            results[index] = nums[left] * nums[left];
            left++;
        } else {
            results[index] = nums[right] * nums[right];
            right--;
        }
        index--;
        }
        
        return results;
    }
}

