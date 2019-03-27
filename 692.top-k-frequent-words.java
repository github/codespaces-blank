/*
 * @lc app=leetcode id=692 lang=java
 *
 * [692] Top K Frequent Words
 *
 * https://leetcode.com/problems/top-k-frequent-words/description/
 *
 * algorithms
 * Medium (44.68%)
 * Total Accepted:    53K
 * Total Submissions: 118.1K
 * Testcase Example:  '["i", "love", "leetcode", "i", "love", "coding"]\n2'
 *
 * Given a non-empty list of words, return the k most frequent elements.
 * Your answer should be sorted by frequency from highest to lowest. If two
 * words have the same frequency, then the word with the lower alphabetical
 * order comes first.
 * 
 * Example 1:
 * 
 * Input: ["i", "love", "leetcode", "i", "love", "coding"], k = 2
 * Output: ["i", "love"]
 * Explanation: "i" and "love" are the two most frequent words.
 * ⁠   Note that "i" comes before "love" due to a lower alphabetical order.
 * 
 * 
 * 
 * Example 2:
 * 
 * Input: ["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is",
 * "is"], k = 4
 * Output: ["the", "is", "sunny", "day"]
 * Explanation: "the", "is", "sunny" and "day" are the four most frequent
 * words,
 * ⁠   with the number of occurrence being 4, 3, 2 and 1 respectively.
 * 
 * 
 * 
 * Note:
 * 
 * You may assume k is always valid, 1 ≤ k ≤ number of unique elements.
 * Input words contain only lowercase letters.
 * 
 * 
 * 
 * Follow up:
 * 
 * Try to solve it in O(n log k) time and O(n) extra space.
 * 
 * 
 */
// Lambda Comparator
class Solution {
    public List<String> topKFrequent(String[] words, int k) {
        Map<String, Integer> countMap = new HashMap<>();
        for (String word : words) {
            countMap.put(word, countMap.getOrDefault(word, 0) + 1);
        }
        List<String> result = new ArrayList<>(countMap.keySet());
        Collections.sort(result, (w1, w2) -> countMap.get(w1).equals(countMap.get(w2)) ? w1.compareTo(w2) : countMap.get(w2) - countMap.get(w1));
        return result.subList(0, k);
    }
}

// Classic Comparator
class Solution {
    public List<String> topKFrequent(String[] words, int k) {
        Map<String, Integer> countMap = new HashMap<>();
        for (String word : words) {
            countMap.put(word, countMap.getOrDefault(word, 0) + 1);
        }
        List<String> result = new ArrayList<>(countMap.keySet());
        Collections.sort(result, new Comparator<String>(){
            @Override
            public int compare(String e1, String e2) {
                if (countMap.get(e1).equals(countMap.get(e2))) {
                    return e1.compareTo(e2);
                }
                return countMap.get(e1) < countMap.get(e2) ? 1 : -1;
            }
        });
        return result.subList(0, k);
    }
}


// HashMap with MaxHeap
class Solution {
    public List<String> topKFrequent(String[] words, int k) {
        Map<String, Integer> map = new HashMap<>();
        for (String word : words) {
            map.put(word, map.getOrDefault(word, 0) + 1);
        }
        PriorityQueue<String> maxHeap = new PriorityQueue<String>(new Comparator<String> (){
            @Override
            public int compare(String s1, String s2) {
                if (map.get(s1).equals(map.get(s2))) {
                    // alphabetical order
                    return s1.compareTo(s2);
                }
                return map.get(s1) < map.get(s2) ? 1 : -1;
            }
        });
        
        for (String word : map.keySet()) {
            maxHeap.offer(word);
            if (maxHeap.size() > k) {
                maxHeap.poll();
            }
        }
        
        List<String> result = new ArrayList<>();
        while (!maxHeap.isEmpty() && k > 0) {
            result.add(maxHeap.poll());
            k--;
        }
        return result;
    }
}
