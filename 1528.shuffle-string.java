/*
 * @lc app=leetcode id=1528 lang=java
 *
 * [1528] Shuffle String
 *
 * https://leetcode.com/problems/shuffle-string/description/
 *
 * algorithms
 * Easy (85.82%)
 * Likes:    1494
 * Dislikes: 267
 * Total Accepted:    213.8K
 * Total Submissions: 249.4K
 * Testcase Example:  '"codeleet"\n[4,5,6,7,0,2,1,3]'
 *
 * You are given a string s and an integer array indices of the same length.
 * The string s will be shuffled such that the character at the i^th position
 * moves to indices[i] in the shuffled string.
 * 
 * Return the shuffled string.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: s = "codeleet", indices = [4,5,6,7,0,2,1,3]
 * Output: "leetcode"
 * Explanation: As shown, "codeleet" becomes "leetcode" after shuffling.
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: s = "abc", indices = [0,1,2]
 * Output: "abc"
 * Explanation: After shuffling, each character remains in its position.
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * s.length == indices.length == n
 * 1 <= n <= 100
 * s consists of only lowercase English letters.
 * 0 <= indices[i] < n
 * All values of indices are unique.
 * 
 * 
 */

// @lc code=start

// sort
// no need extra space, but time complexity is high
// class Solution {
//     public String restoreString(String s, int[] indices) {
//         StringBuffer result = new StringBuffer();
//         while (result.length() < s.length()) {
//             for (int i = 0; i < s.length(); i++) {
//                 if (indices[i] == result.length()) {
//                     result.append(s.charAt(i));
//                     break;
//                 }
//             }
//         }

//         return result.toString();
//     }
// }

// create a new array and put the value in order then combine to a new string
// need extra space
class Solution {
    public String restoreString(String s, int[] indices) {
        char[] s2 = new char[s.length()];

        for (int i = 0; i < s.length(); i++) {
            s2[indices[i]] = s.charAt(i); 
        }

        StringBuffer result = new StringBuffer();
        for (char c : s2) {
            result.append(c);
        }

        return result.toString();
    }
}

//
// @lc code=end

