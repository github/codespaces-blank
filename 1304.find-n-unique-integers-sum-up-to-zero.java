/*
 * @lc app=leetcode id=1304 lang=java
 *
 * [1304] Find N Unique Integers Sum up to Zero
 *
 * https://leetcode.com/problems/find-n-unique-integers-sum-up-to-zero/description/
 *
 * algorithms
 * Easy (75.91%)
 * Likes:    289
 * Dislikes: 180
 * Total Accepted:    46.3K
 * Total Submissions: 61K
 * Testcase Example:  '5'
 *
 * Given an integer n, return any array containing n unique integers such that
 * they add up to 0.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: n = 5
 * Output: [-7,-1,1,3,4]
 * Explanation: These arrays also are accepted [-5,-1,1,2,3] ,
 * [-3,-1,2,-2,4].
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: n = 3
 * Output: [-1,0,1]
 * 
 * 
 * Example 3:
 * 
 * 
 * Input: n = 1
 * Output: [0]
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * 1 <= n <= 1000
 * 
 */

// @lc code=start
// https://leetcode.com/problems/find-n-unique-integers-sum-up-to-zero/discuss/465585/JavaC%2B%2BPython-Find-the-Rule
class Solution {
    public int[] sumZero(int n) {
        int[] result = new int[n];

        for (int i = 0; i < n; i++) {
            result[i] = i * 2 - n + 1;
        }

        return result;
    }
}
// @lc code=end

