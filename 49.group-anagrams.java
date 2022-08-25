/*
 * @lc app=leetcode id=49 lang=java
 *
 * [49] Group Anagrams
 *
 * https://leetcode.com/problems/group-anagrams/description/
 *
 * algorithms
 * Medium (44.56%)
 * Total Accepted:    306.7K
 * Total Submissions: 677.5K
 * Testcase Example:  '["eat","tea","tan","ate","nat","bat"]'
 *
 * Given an array of strings, group anagrams together.
 * 
 * Example:
 * 
 * 
 * Input: ["eat", "tea", "tan", "ate", "nat", "bat"],
 * Output:
 * [
 * ⁠ ["ate","eat","tea"],
 * ⁠ ["nat","tan"],
 * ⁠ ["bat"]
 * ]
 * 
 * Note:
 * 
 * 
 * All inputs will be in lowercase.
 * The order of your output does not matter.
 * 
 * 
 */
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        if (strs == null || strs.length == 0) {
            return new ArrayList();
        }
        Map<String, List> ans = new HashMap<>();
        for (String s : strs) {
            char[] sArray = s.toCharArray();
            Arrays.sort(sArray);
            String key = String.valueOf(sArray);
            if (!ans.containsKey(key)) {
                ans.put(key, new ArrayList());
            } 
            ans.get(key).add(s);
        }
        return new ArrayList(ans.values());
    }
}

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        if (strs == null || strs.length == 0) {
            return new ArrayList();
        }
        
        Map<String, List<String>> group = new HashMap<>();
        for (String s : strs) {
            String code = encode(s);
            group.putIfAbsent(code, new ArrayList());
            group.get(code).add(s);
        }
        
        return new ArrayList(group.values());
    }
    
    // encode hash based on element appearence times
    String encode(String s) {
        char[] count = new char[26];
        for (char c : s.toCharArray()) {
            int delta = c - 'a';
            count[delta]++;
        }
        
        return new String(count);
    }
}

/**
 * Hash_Map.values()
 * Parameters: The method does not accept any parameters.
 * Return Value: The method is used to return a collection view containing all the values of the map.
 */
