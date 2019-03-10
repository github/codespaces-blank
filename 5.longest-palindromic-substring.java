/*
 * @lc app=leetcode id=5 lang=java
 *
 * [5] Longest Palindromic Substring
 *
 * https://leetcode.com/problems/longest-palindromic-substring/description/
 *
 * algorithms
 * Medium (26.49%)
 * Total Accepted:    487.4K
 * Total Submissions: 1.8M
 * Testcase Example:  '"babad"'
 *
 * Given a string s, find the longest palindromic substring in s. You may
 * assume that the maximum length of s is 1000.
 * 
 * Example 1:
 * 
 * 
 * Input: "babad"
 * Output: "bab"
 * Note: "aba" is also a valid answer.
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: "cbbd"
 * Output: "bb"
 * 
 * 
 */
class Solution {
    public String longestPalindrome(String s) {
        if (s == null) {
            return null;
        }

        String result = "";
        for (int i = 0; i < s.length(); i++) {
            String temp;

            // odd palindrome
            temp = getPalindrome(s, i, i);
            if (temp.length() > result.length()) {
                result = temp;
            }

            // even palindrome
            temp = getPalindrome(s, i, i + 1);
            if (temp.length() > result.length()) {
                result = temp;
            }
        }
        return result;
    }

    private String getPalindrome(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            l--;
            r++;
        }
        // l and r points to the outside of the word
        return s.substring(l + 1, r);
    }
}

