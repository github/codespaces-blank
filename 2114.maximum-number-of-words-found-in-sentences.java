/*
 * @lc app=leetcode id=2114 lang=java
 *
 * [2114] Maximum Number of Words Found in Sentences
 *
 * https://leetcode.com/problems/maximum-number-of-words-found-in-sentences/description/
 *
 * algorithms
 * Easy (89.24%)
 * Likes:    138
 * Dislikes: 3
 * Total Accepted:    14.7K
 * Total Submissions: 16.4K
 * Testcase Example:  '["alice and bob love leetcode","i think so too","this is great thanks very much"]'
 *
 * A sentence is a list of words that are separated by a single space with no
 * leading or trailing spaces.
 * 
 * You are given an array of strings sentences, where each sentences[i]
 * represents a single sentence.
 * 
 * Return the maximum number of words that appear in a single sentence.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: sentences = ["alice and bob love leetcode", "i think so too", "this
 * is great thanks very much"]
 * Output: 6
 * Explanation: 
 * - The first sentence, "alice and bob love leetcode", has 5 words in total.
 * - The second sentence, "i think so too", has 4 words in total.
 * - The third sentence, "this is great thanks very much", has 6 words in
 * total.
 * Thus, the maximum number of words in a single sentence comes from the third
 * sentence, which has 6 words.
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: sentences = ["please wait", "continue to fight", "continue to win"]
 * Output: 3
 * Explanation: It is possible that multiple sentences contain the same number
 * of words. 
 * In this example, the second and third sentences (underlined) have the same
 * number of words.
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * 1 <= sentences.length <= 100
 * 1 <= sentences[i].length <= 100
 * sentences[i] consists only of lowercase English letters and ' ' only.
 * sentences[i] does not have leading or trailing spaces.
 * All the words in sentences[i] are separated by a single space.
 * 
 * 
 */

// @lc code=start
class Solution {
    public int mostWordsFound(String[] sentences) {
        if (sentences == null || sentences.length < 1) {
            return 0;
        }

        int countOfWords = 0;
        for (String sentence: sentences) {
            countOfWords = Math.max(countOfWords, countWords(sentence));
        }

        return countOfWords;
    }

    public int countWords(String sentence) {
        int countOfSpace = 0;
        
        for (int i = 0; i < sentence.length(); i++) {
            if (sentence.charAt(i) == ' ') {
                countOfSpace++;
            }
        }

        return countOfSpace + 1;
    }
}

class Solution {
    public int mostWordsFound(String[] sentences) {
        int max = 0;
        
        for(int i = 0; i < sentences.length; i++) {
            max = Math.max(max, (sentences[i].split(" ")).length);
        }
        
        return max;
    }
}
// @lc code=end

