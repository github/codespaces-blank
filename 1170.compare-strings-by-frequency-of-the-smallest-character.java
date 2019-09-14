/*
 * @lc app=leetcode id=1170 lang=java
 *
 * [1170] Compare Strings by Frequency of the Smallest Character
 *
 * https://leetcode.com/problems/compare-strings-by-frequency-of-the-smallest-character/description/
 *
 * algorithms
 * Easy (61.36%)
 * Likes:    38
 * Dislikes: 69
 * Total Accepted:    7.7K
 * Total Submissions: 12.5K
 * Testcase Example:  '["cbd"]\n["zaaaz"]'
 *
 * Let's define a function f(s) over a non-empty string s, which calculates the
 * frequency of the smallest character in s. For example, if s = "dcce" then
 * f(s) = 2 because the smallest character is "c" and its frequency is 2.
 * 
 * Now, given string arrays queries and words, return an integer array answer,
 * where each answer[i] is the number of words such that f(queries[i]) < f(W),
 * where W is a word in words.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: queries = ["cbd"], words = ["zaaaz"]
 * Output: [1]
 * Explanation: On the first query we have f("cbd") = 1, f("zaaaz") = 3 so
 * f("cbd") < f("zaaaz").
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: queries = ["bbb","cc"], words = ["a","aa","aaa","aaaa"]
 * Output: [1,2]
 * Explanation: On the first query only f("bbb") < f("aaaa"). On the second
 * query both f("aaa") and f("aaaa") are both > f("cc").
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * 1 <= queries.length <= 2000
 * 1 <= words.length <= 2000
 * 1 <= queries[i].length, words[i].length <= 10
 * queries[i][j], words[i][j] are English lowercase letters.
 * 
 * 
 */
class Solution {
    public int[] numSmallerByFrequency(String[] queries, String[] words) {
        int[] q = new int[queries.length];
        int[] w = new int[words.length];
        for (int i = 0; i < queries.length; i++) {
            q[i] = calculateFrequency(queries[i]);
        }
        for (int i = 0; i < words.length; i++) {
            w[i] = calculateFrequency(words[i]);
        }
        int[] result = new int[queries.length];
        
        // Method 1: Normal
        // for (int i = 0; i < queries.length; i++) {
        //     for (int j = 0; j < words.length; j++) {
        //         if (w[j] > q[i]) {
        //             result[i]++;
        //         }
        //     }
        // }
        
        // Method 2: Binary Search
        Arrays.sort(w);
        for (int i = 0; i < q.length; i++) {
            int left = 0;
            int right = w.length - 1;
            while (left <= right) {
                int mid = (left + right) / 2;
                if (w[mid] <= q[i]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
            result[i] = w.length - left;
        }
        
        return result;
    }
    
    private int calculateFrequency(String input) {
        int[] maps = new int[26];
        for (char c : input.toCharArray()) {
            maps[c - 'a']++;
        }
        for (int i = 0; i < maps.length; i++) {
            if (maps[i] != 0) {
                return maps[i];
            }
        }
        return 0;
    }
}

