/*
 * @lc app=leetcode id=1480 lang=java
 *
 * [1480] Running Sum of 1d Array
 */

// @lc code=start
class Solution {
    // bad solution, no need to create a new variable.
    public int[] runningSum(int[] nums) {
        if (nums == null || nums.length == 0) {
            return new int[] {};
        }
        
        int[] result = new int[nums.length];
        int sum = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];
            result[i] = sum;
        }
        
        return result;
    }
}

// better solution
class Solution {
    public int[] runningSum(int[] nums) {
        if (nums == null || nums.length == 0) {
            return new int[] {};
        }
        
        int index = 1;
        while (index < nums.length) {
            nums[index] += nums[index - 1];
            index++;
        }

        return nums;
    }
}
// @lc code=end

