/*
 * @lc app=leetcode id=279 lang=java
 *
 * [279] Perfect Squares
 *
 * https://leetcode.com/problems/perfect-squares/description/
 *
 * algorithms
 * Medium (40.62%)
 * Total Accepted:    160.8K
 * Total Submissions: 395.7K
 * Testcase Example:  '12'
 *
 * Given a positive integer n, find the least number of perfect square numbers
 * (for example, 1, 4, 9, 16, ...) which sum to n.
 * 
 * Example 1:
 * 
 * 
 * Input: n = 12
 * Output: 3 
 * Explanation: 12 = 4 + 4 + 4.
 * 
 * Example 2:
 * 
 * 
 * Input: n = 13
 * Output: 2
 * Explanation: 13 = 4 + 9.
 */
class Solution {
    public int numSquares(int n) {
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            dp[i] = Integer.MAX_VALUE;
        }
        for (int i = 1; i <= n; i++) {
            int sqrt = (int)Math.sqrt(i);
            if (sqrt * sqrt == i) {
                dp[i] = 1;
                continue;
            }
            
            for (int j = 1; j <= sqrt; j++) {
                int dif = i - j * j;
                dp[i] = Math.min(dp[i], (dp[dif] + 1));
            }
        }
        return dp[n];
    }
}
