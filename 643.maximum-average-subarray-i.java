/*
 * @lc app=leetcode id=643 lang=java
 *
 * [643] Maximum Average Subarray I
 *
 * https://leetcode.com/problems/maximum-average-subarray-i/description/
 *
 * algorithms
 * Easy (43.16%)
 * Likes:    1713
 * Dislikes: 161
 * Total Accepted:    151.7K
 * Total Submissions: 347K
 * Testcase Example:  '[1,12,-5,-6,50,3]\n4'
 *
 * You are given an integer array nums consisting of n elements, and an integer
 * k.
 * 
 * Find a contiguous subarray whose length is equal to k that has the maximum
 * average value and return this value. Any answer with a calculation error
 * less than 10^-5 will be accepted.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: nums = [1,12,-5,-6,50,3], k = 4
 * Output: 12.75000
 * Explanation: Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: nums = [5], k = 1
 * Output: 5.00000
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * n == nums.length
 * 1 <= k <= n <= 10^5
 * -10^4 <= nums[i] <= 10^4
 * 
 * 
 */

// @lc code=start
class Solution {
    // calculate the average for each window
    public double findMaxAverage(int[] nums, int k) {
        if (nums == null || nums.length <= 0) {
            return 0;
        }
        int windowStart = 0;
        // Double.MIN_VALUE does not work it returns the smallest **positive** double value
        // https://stackoverflow.com/questions/3884793/why-is-double-min-value-in-not-negative
        double maxAverage = -Double.MAX_VALUE, windowSum = 0;

        for (int windowEnd = 0; windowEnd < nums.length; windowEnd++) {
            windowSum += nums[windowEnd];
            if (windowEnd >= k - 1) {
                double windowAverage = windowSum / k;
                maxAverage = Math.max(maxAverage, windowAverage);
                windowSum -= nums[windowStart];
                windowStart++;
            }
        }

        return maxAverage;
    }

    // find the maxSum and get the average at the end
    public double findMaxAverage(int[] nums, int k) {
        if (nums == null || nums.length <= 0) {
            return 0;
        }
        int windowStart = 0;
        int maxSum = Integer.MIN_VALUE, windowSum = 0;

        for (int windowEnd = 0; windowEnd < nums.length; windowEnd++) {
            windowSum += nums[windowEnd];
            if (windowEnd >= k - 1) {
                maxSum = Math.max(maxSum, windowSum);
                windowSum -= nums[windowStart];
                windowStart++;
            }
        }

        // new Double(maxSum / k) does not work
        //return new Double(maxSum) / k; //low performance
        return maxSum / new Double(k);
    }
}
// @lc code=end

