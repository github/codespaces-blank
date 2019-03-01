/*
 * @lc app=leetcode id=344 lang=java
 *
 * [344] Reverse String
 *
 * https://leetcode.com/problems/reverse-string/description/
 *
 * algorithms
 * Easy (62.75%)
 * Total Accepted:    374.2K
 * Total Submissions: 596.3K
 * Testcase Example:  '["h","e","l","l","o"]'
 *
 * Write a function that reverses a string. The input string is given as an
 * array of characters char[].
 * 
 * Do not allocate extra space for another array, you must do this by modifying
 * the input array in-place with O(1) extra memory.
 * 
 * You may assume all the characters consist of printable ascii
 * characters.
 * 
 * 
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: ["h","e","l","l","o"]
 * Output: ["o","l","l","e","h"]
 * 
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: ["H","a","n","n","a","h"]
 * Output: ["h","a","n","n","a","H"]
 * 
 * 
 * 
 * 
 */
class Solution {
    // public void reverseString(char[] s) {
    //     reverseString(s, 0);
    // }

    // private void reverseString(char[] s, int index) {
    //     // base case
    //     if (index >= s.length / 2) {
    //         return;
    //     }
    //     // recursive rule
    //     swap(s, index, s.length - index - 1);
    //     reverseString(s, index + 1);
    // }

    // private void swap(char[] s, int left, int right) {
    //     char temp = s[left];
    //     s[left] = s[right];
    //     s[right] = temp;
    // }

    // tail recusion
    // public void reverseString(char[] s) {
    //     helper(0, s.length - 1, s);
    // }

    // private void helper(int start, int end, char[] s) {
    //     if (start >= end) {
    //         return;
    //     }

    //     // swap between the first and the last element
    //     char temp = s[start];
    //     s[start] = s[end];
    //     s[end] = temp;

    //     helper(start + 1, end - 1, s);
    // }

    public void reverseString(char[] s) {
        helper(0, s.length - 1, s);
    }

    private void helper(int start, int end, char[] s) {
        if (start >= end) {
            return;
        }

        helper(start + 1, end - 1, s);

        // swap between the first and the last element
        char temp = s[start];
        s[start] = s[end];
        s[end] = temp;
    }
}

