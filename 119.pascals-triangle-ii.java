/*
 * @lc app=leetcode id=119 lang=java
 *
 * [119] Pascal's Triangle II
 *
 * https://leetcode.com/problems/pascals-triangle-ii/description/
 *
 * algorithms
 * Easy (41.94%)
 * Total Accepted:    185.8K
 * Total Submissions: 441.6K
 * Testcase Example:  '3'
 *
 * Given a non-negative index k where k ≤ 33, return the k^th index row of the
 * Pascal's triangle.
 * 
 * Note that the row index starts from 0.
 * 
 * 
 * In Pascal's triangle, each number is the sum of the two numbers directly
 * above it.
 * 
 * Example:
 * 
 * 
 * Input: 3
 * Output: [1,3,3,1]
 * 
 * 
 * Follow up:
 * 
 * Could you optimize your algorithm to use only O(k) extra space?
 * 
 */

// Iterative
// class Solution {
//     public List<Integer> getRow(int rowIndex) {
//         ArrayList<Integer> result = new ArrayList<>();
//         for (int i = 0; i <= rowIndex; i++) {
//             result.add(0, 1);
//             for (int j = 1; j < result.size() - 1; j++) {
//                 result.set(j, result.get(j) + result.get(j + 1));
//             }
//         }
//         return result;
//     }
// }

// Recursive
/**
 * 32/34 cases passed
 * testcase: 32
 * Limited Time Exceeded
 */
class Solution {
    public List<Integer> getRow(int rowIndex) {
        ArrayList<Integer> result = new ArrayList<>();
        for (int j = 0; j <= rowIndex; j++) {
            result.add(pascal(rowIndex, j));
        }
        return result;
    }

    private int pascal(int rowIndex, int j) {
        if (j == 0 || j == rowIndex) {
            return 1;
        }
        return pascal(rowIndex - 1, j - 1) + pascal(rowIndex - 1, j);
    }
}

