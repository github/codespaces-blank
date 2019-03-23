/*
 * @lc app=leetcode id=186 lang=java
 *
 * [186] Reverse Words in a String II
 *
 * https://leetcode.com/problems/reverse-words-in-a-string-ii/description/
 *
 * algorithms
 * Medium (36.01%)
 * Total Accepted:    61.9K
 * Total Submissions: 168.9K
 * Testcase Example:  '["t","h","e"," ","s","k","y"," ","i","s"," ","b","l","u","e"]'
 *
 * Given an input string , reverse the string word by word. 
 * 
 * Example:
 * 
 * 
 * Input:  ["t","h","e"," ","s","k","y"," ","i","s"," ","b","l","u","e"]
 * Output: ["b","l","u","e"," ","i","s"," ","s","k","y"," ","t","h","e"]
 * 
 * Note: 
 * 
 * 
 * A word is defined as a sequence of non-space characters.
 * The input string does not contain leading or trailing spaces.
 * The words are always separated by a single space.
 * 
 * 
 * Follow up: Could you do it in-place without allocating extra space?
 * 
 */

 // reverse whole string
 // reverse each words
class Solution {
    public void reverseWords(char[] str) {
        if (str == null || str.length < 2) {
            return;
        }
        reverse(str, 0, str.length - 1);
        int left = 0;
        for (int i = 1; i < str.length; i++) {
            // meet space, update left pointer
            if (str[i] == ' ') {
                left = i + 1;
            } else if (i == str.length - 1 || str[i + 1] == ' ') {
                // reverse words in the string
                reverse(str, left, i);
            }
        }
    }

    private void reverse(char[] s, int left, int right) {
        while (left < right) {
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }
    }
}

