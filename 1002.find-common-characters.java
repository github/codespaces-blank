/*
 * @lc app=leetcode id=1002 lang=java
 *
 * [1002] Find Common Characters
 *
 * https://leetcode.com/problems/find-common-characters/description/
 *
 * algorithms
 * Easy (65.76%)
 * Likes:    306
 * Dislikes: 44
 * Total Accepted:    27.8K
 * Total Submissions: 42.3K
 * Testcase Example:  '["bella","label","roller"]'
 *
 * Given an array A of strings made only from lowercase letters, return a list
 * of all characters that show up in all strings within the list (including
 * duplicates).  For example, if a character occurs 3 times in all strings but
 * not 4 times, you need to include that character three times in the final
 * answer.
 * 
 * You may return the answer in any order.
 * 
 * 
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: ["bella","label","roller"]
 * Output: ["e","l","l"]
 * 
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: ["cool","lock","cook"]
 * Output: ["c","o"]
 * 
 * 
 * 
 * 
 * Note:
 * 
 * 
 * 1 <= A.length <= 100
 * 1 <= A[i].length <= 100
 * A[i][j] is a lowercase letter
 * 
 * 
 * 
 */
class Solution {
    public List<String> commonChars(String[] A) {
        if (A == null || A.length < 1) {
            return new ArrayList<String>();
        }
        
        List<String> result = new ArrayList<>();
        // a global array which stores the min frequent chars among all strings
        int[] count = new int[26];
        Arrays.fill(count, Integer.MAX_VALUE);
        
        for (String str : A) {
            // find out the frequent for all char from one string
            int[] temp = new int[26];
            for (int i = 0; i < str.length(); i++) {
                temp[str.charAt(i) - 'a']++;
            }
            // update the global array, which determin the min frequent char among all strings
            for (int i = 0; i < 26; i++) {
                count[i] = Math.min(count[i], temp[i]);
            }
        }
        
        for (int i = 0; i < count.length; i++) {
            while (count[i]-- > 0) {
                result.add(String.valueOf((char)(i + 'a')));
            }
        }
        
        return result;
    }
}

