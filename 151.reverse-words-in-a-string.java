/*
 * @lc app=leetcode id=151 lang=java
 *
 * [151] Reverse Words in a String
 *
 * https://leetcode.com/problems/reverse-words-in-a-string/description/
 *
 * algorithms
 * Medium (15.83%)
 * Total Accepted:    260.1K
 * Total Submissions: 1.6M
 * Testcase Example:  '"the sky is blue"'
 *
 * Given an input string, reverse the string word by word.
 * 
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: "the sky is blue"
 * Output: "blue is sky the"
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: "  hello world!  "
 * Output: "world! hello"
 * Explanation: Your reversed string should not contain leading or trailing
 * spaces.
 * 
 * 
 * Example 3:
 * 
 * 
 * Input: "a good   example"
 * Output: "example good a"
 * Explanation: You need to reduce multiple spaces between two words to a
 * single space in the reversed string.
 * 
 * 
 * 
 * 
 * Note:
 * 
 * 
 * A word is defined as a sequence of non-space characters.
 * Input string may contain leading or trailing spaces. However, your reversed
 * string should not contain leading or trailing spaces.
 * You need to reduce multiple spaces between two words to a single space in
 * the reversed string.
 * 
 * 
 * 
 * 
 * Follow up:
 * 
 * For C programmers, try to solve it in-place in O(1) extra space.
 */

// While iterating the string in reverse order, we keep track of a word's begin and end position. 
// When we are at the beginning of a word, we append it.
class Solution {
    public String reverseWords(String s) {
        StringBuilder reversed = new StringBuilder();

        // j: right pointer of words. the last index of word + 1
        // i: the left pointer of the first characater
        int j = s.length();
        for (int i = s.length() - 1; i >= 0; i--) {
            // ignore space
            if (s.charAt(i) == ' ') {
                j = i;
            } else if (i == 0 || s.charAt(i - 1) == ' ') {
                // add space between word first
                if (reversed.length() != 0) {
                    reversed.append(' ');
                }
                // sustring and append word to result string
                reversed.append(s.substring(i, j));
            }
        }
        return reversed.toString();
    }
}

