/*
 * @lc app=leetcode id=557 lang=java
 *
 * [557] Reverse Words in a String III
 *
 * https://leetcode.com/problems/reverse-words-in-a-string-iii/description/
 *
 * algorithms
 * Easy (79.78%)
 * Likes:    4534
 * Dislikes: 220
 * Total Accepted:    646.2K
 * Total Submissions: 790.2K
 * Testcase Example:  `"Let's take LeetCode contest"`
 *
 * Given a string s, reverse the order of characters in each word within a
 * sentence while still preserving whitespace and initial word order.
 * 
 * 
 * Example 1:
 * Input: s = "Let's take LeetCode contest"
 * Output: "s'teL ekat edoCteeL tsetnoc"
 * Example 2:
 * Input: s = "God Ding"
 * Output: "doG gniD"
 * 
 * 
 * Constraints:
 * 
 * 
 * 1 <= s.length <= 5 * 10^4
 * s contains printable ASCII characters.
 * s does not contain any leading or trailing spaces.
 * There is at least one word in s.
 * All the words in s are separated by a single space.
 * 
 * 
 */

// @lc code=start
class Solution {
    public String reverseWords(String s) {
        int lastSpaceIndex = -1;
        char[] arr = s.toCharArray();
        int length = s.length();

        for (int strIndex = 0; strIndex <= length; strIndex++) {
            if (strIndex == length || arr[strIndex] == ' ') {
                int startIndex = lastSpaceIndex + 1;
                int endIndex = strIndex - 1;
                swapString(arr, startIndex, endIndex);
                lastSpaceIndex = strIndex;
            }
        }

        return new String(arr);
    }

    private void swapString(char[] arr, int left, int right) {
        while (left <= right) {
            char temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }
}
// @lc code=end

