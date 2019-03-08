import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/*
 * @lc app=leetcode id=3 lang=java
 *
 * [3] Longest Substring Without Repeating Characters
 *
 * https://leetcode.com/problems/longest-substring-without-repeating-characters/description/
 *
 * algorithms
 * Medium (27.18%)
 * Total Accepted:    821.2K
 * Total Submissions: 2.9M
 * Testcase Example:  '"abcabcbb"'
 *
 * Given a string, find the length of the longest substring without repeating
 * characters.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: "abcabcbb"
 * Output: 3 
 * Explanation: The answer is "abc", with the length of 3. 
 * 
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: "bbbbb"
 * Output: 1
 * Explanation: The answer is "b", with the length of 1.
 * 
 * 
 * 
 * Example 3:
 * 
 * 
 * Input: "pwwkew"
 * Output: 3
 * Explanation: The answer is "wke", with the length of 3. 
 * ⁠            Note that the answer must be a substring, "pwke" is a
 * subsequence and not a substring.
 * 
 * 
 * 
 * 
 */

 // hashset with two pointers
 // add fast to set when there is no duplicates
 // remove slow from set when there are duplicates
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> distinct = new HashSet<>();
        int slow = 0;
        int fast = 0;
        int longest = 0;
        while (fast < s.length()) {
            if (distinct.contains(s.charAt(fast))) {
                distinct.remove(s.charAt(slow));
                slow++;
            } else {
                distinct.add(s.charAt(fast));
                fast++;
                longest = Math.max(longest, fast - slow);
            }
        }
        return longest;
    }
}

//The reason is that if s[j] have a duplicate in the range [i, j) with index j
// we don't need to increase i little by little. 
// We can skip all the elements in the range [i, j] and let i to be j+1 directly.
class Solution {
    public int lengthOfLongestSubstring(String s) {
        int n = s.length();
        int longest = 0;
        Map<Character, Integer> map = new HashMap<>();
        int fast = 0;
        int slow = 0;
        for (; fast < n; fast++) {
            if (map.containsKey(s.charAt(fast))) {
                slow = Math.max(map.get(s.charAt(fast)), slow);
            }
            longest = Math.max(longest, fast - slow + 1);
            map.put(s.charAt(fast), fast + 1);
        }
        return longest;
    }
}

