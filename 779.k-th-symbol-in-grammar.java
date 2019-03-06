/*
 * @lc app=leetcode id=779 lang=java
 *
 * [779] K-th Symbol in Grammar
 *
 * https://leetcode.com/problems/k-th-symbol-in-grammar/description/
 *
 * algorithms
 * Medium (37.76%)
 * Total Accepted:    10.5K
 * Total Submissions: 27.9K
 * Testcase Example:  '1\n1'
 *
 * On the first row, we write a 0. Now in every subsequent row, we look at the
 * previous row and replace each occurrence of 0 with 01, and each occurrence
 * of 1 with 10.
 * 
 * Given row N and index K, return the K-th indexed symbol in row N. (The
 * values of K are 1-indexed.) (1 indexed).
 * 
 * 
 * Examples:
 * Input: N = 1, K = 1
 * Output: 0
 * 
 * Input: N = 2, K = 1
 * Output: 0
 * 
 * Input: N = 2, K = 2
 * Output: 1
 * 
 * Input: N = 4, K = 5
 * Output: 1
 * 
 * Explanation:
 * row 1: 0
 * row 2: 01
 * row 3: 0110
 * row 4: 01101001
 * 
 * 
 * Note:
 * 
 * 
 * N will be an integer in the range [1, 30].
 * K will be an integer in the range [1, 2^(N-1)].
 * 
 * 
 */

/**
 * The idea is to represent the generated sequence as binary tree and follow the path down instead of creating the whole tree. left represents number of leafs left under the node we are currently at. Every time we go down, number of leafs below decreses by half. val only changes when we go right (0 -> 01, 1 -> 10).
 */
class Solution {
    public int kthGrammar(int N, int K) {
        int left = (int) Math.pow(2, N);
        int val = 0;
        for (int i = 0; i < N; i++) {
            if (K > left / 2) { // go right leaf
                val = 1 - val;
                K = K - left / 2;
            }
            left /= 2;
        }
        return val;
    }
}

