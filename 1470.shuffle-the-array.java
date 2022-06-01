/*
 * @lc app=leetcode id=1470 lang=java
 *
 * [1470] Shuffle the Array
 */

// @lc code=start
class Solution {
    public int[] shuffle(int[] nums, int n) {
        if (nums == null || nums.length == 0) {
            return new int[] {};
        }
        
        int[] result = new int[nums.length];
        for (int i = 0; i < n; i++) {
            result[2 * i] = nums[i];
            result[2 * i + 1] = nums[n + i];
        }
        
        return result;
    }
}

class Solution {
    public int[] shuffle(int[] nums, int n) {
        if (nums.length <= 1 || nums.length < n) {
            return nums;
        }
        int[] result = new int[n * 2];
        int left = 0;
        int right = n;
        int index = 0;
        for (int i = 0; i < n; i++) {
            result[index++] = nums[left++];
            result[index++] = nums[right++];
        }
        
        return result;
    }
}
// @lc code=end

