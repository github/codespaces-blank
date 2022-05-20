import java.util.Map;

/*
 * @lc app=leetcode id=340 lang=java
 *
 * [340] Longest Substring with At Most K Distinct Characters
 *
 * https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/description/
 *
 * algorithms
 * Medium (47.38%)
 * Likes:    2295
 * Dislikes: 70
 * Total Accepted:    275.8K
 * Total Submissions: 582.2K
 * Testcase Example:  '"eceba"\n2'
 *
 * Given a string s and an integer k, return the length of the longest
 * substring of s that contains at most k distinct characters.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: s = "eceba", k = 2
 * Output: 3
 * Explanation: The substring is "ece" with length 3.
 * 
 * Example 2:
 * 
 * 
 * Input: s = "aa", k = 1
 * Output: 2
 * Explanation: The substring is "aa" with length 2.
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * 1 <= s.length <= 5 * 10^4
 * 0 <= k <= 50
 * 
 * 
 */

// @lc code=start
class Solution {
    public int lengthOfLongestSubstringKDistinct(String s, int k) {
        if (s == null || s.length() == 0) {
            return 0;
        }

        int left = 0, right = 0, maxLength = 0;
        Map<Character, Integer> map = new HashMap<>();
        for ( ; right < s.length(); right++) {
            char currentChar = s.charAt(right);
            map.put(currentChar, map.getOrDefault(currentChar, 0) + 1);
            while (map.size() > k) {
                char leftChar = s.charAt(left);
                map.put(leftChar, map.get(leftChar) - 1);
                if (map.get(leftChar) == 0) {
                    map.remove(leftChar);
                }
                left++;
            }
            maxLength = Math.max(right - left + 1, maxLength);
        }
        return maxLength;
    }
}
// @lc code=end

