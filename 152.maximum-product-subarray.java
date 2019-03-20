/*
 * @lc app=leetcode id=152 lang=java
 *
 * [152] Maximum Product Subarray
 *
 * https://leetcode.com/problems/maximum-product-subarray/description/
 *
 * algorithms
 * Medium (28.52%)
 * Total Accepted:    194.2K
 * Total Submissions: 677.3K
 * Testcase Example:  '[2,3,-2,4]'
 *
 * Given an integer array nums, find the contiguous subarray within an array
 * (containing at least one number) which has the largest product.
 * 
 * Example 1:
 * 
 * 
 * Input: [2,3,-2,4]
 * Output: 6
 * Explanation: [2,3] has the largest product 6.
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: [-2,0,-1]
 * Output: 0
 * Explanation: The result cannot be 2, because [-2,-1] is not a subarray.
 * 
 */

 /*
  * Besides keeping track of the largest product, we also need to keep track of the smallest product.
  * The smallest product, which is the largest in the negative sense could become the maximum when being multiplied
  * by a negative number
  * f(k) = largest product subarray, from index 0 up to k.
  * g(k) = Smallest product subarray, from index 0 up to k
  * then,
  * f(k) = max(f(k - 1) * A[k], A[k], g(k - 1) * A[k])
  * g(k) = min(g(k - 1) * A[k], A[k], g(k - 1) * A[k])
  * 
  * loop through the array, each time remember the max and min value for the previous product, the most important
  * thing is to update the max and min value: we have to compare among max* A[i], min * A[i] as well as A[i],
  * since this is product, a negative * negative could be positive
  */
class Solution {
    public int maxProduct(int[] nums) {
        if (nums == null) {
            return 0;
        }
        // [-2] => -2
        if (nums.length < 2) {
            return nums[0];
        }
        int max = nums[0], min = nums[0], result = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int temp = max;
            max = Math.max(Math.max(max * nums[i], min * nums[i]), nums[i]);
            min = Math.min(Math.min(temp * nums[i], min * nums[i]), nums[i]);
            if (max > result) {
                result = max;
            }
        }
        return result;
    }
}

