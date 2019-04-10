/*
 * @lc app=leetcode id=747 lang=java
 *
 * [747] Largest Number At Least Twice of Others
 *
 * https://leetcode.com/problems/largest-number-at-least-twice-of-others/description/
 *
 * algorithms
 * Easy (40.23%)
 * Total Accepted:    46.5K
 * Total Submissions: 115.3K
 * Testcase Example:  '[0,0,0,1]'
 *
 * In a given integer array nums, there is always exactly one largest element.
 * 
 * Find whether the largest element in the array is at least twice as much as
 * every other number in the array.
 * 
 * If it is, return the index of the largest element, otherwise return -1.
 * 
 * Example 1:
 * 
 * 
 * Input: nums = [3, 6, 1, 0]
 * Output: 1
 * Explanation: 6 is the largest integer, and for every other number in the
 * array x,
 * 6 is more than twice as big as x.  The index of value 6 is 1, so we return
 * 1.
 * 
 * 
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: nums = [1, 2, 3, 4]
 * Output: -1
 * Explanation: 4 isn't at least as big as twice the value of 3, so we return
 * -1.
 * 
 * 
 * 
 * 
 * Note:
 * 
 * 
 * nums will have a length in the range [1, 50].
 * Every nums[i] will be an integer in the range [0, 99].
 * 
 * 
 * 
 * 
 */
class Solution {
    public int dominantIndex(int[] nums) {
        if (nums == null) {
            return -1;
        }
        int maxIndex = 0;
        int maxNumber = Integer.MIN_VALUE;
        for (int i = 0; i < nums.length; i++) {
            if (maxNumber < nums[i]) {
                maxNumber = nums[i];
                maxIndex = i;
            }
        }
        for (int i = 0; i < nums.length; i++) {
            if (i == maxIndex) {
                continue;
            }
            /**
             * maxNumber / nums[i] < 2 is not working here
             * nums[i] == 0, then it will throw exception,
             * we can change to 2 * nums[i] > maxNumber to compare
             */
            if (2 * nums[i] > maxNumber) {
                return -1;
            }
        }
        return maxIndex;
    }
}

/**
 * 该方法的巧妙之处是保存第二大的数,
 * 如果最大的数是第二大的数的两倍多, 则说明对于其他比第二大数小的数也成立
 */
class Solution {
    public int dominantIndex(int[] nums) {
        if (nums == null || nums.length == 0) {
            return -1;
        }
        int maxNumber = -1;
        int secondaryMaxNumber = -1;
        int maxIndex = -1;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > maxNumber) {
                secondaryMaxNumber = maxNumber;
                maxNumber = nums[i];
                maxIndex = i;
            } else if (nums[i] > secondaryMaxNumber) {
                secondaryMaxNumber = nums[i];
            }
        }
        return secondaryMaxNumber * 2 > maxNumber ? -1 : maxIndex;
    }
}

