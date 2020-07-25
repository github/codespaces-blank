/*
 * @lc app=leetcode id=1252 lang=java
 *
 * [1252] Cells with Odd Values in a Matrix
 *
 * https://leetcode.com/problems/cells-with-odd-values-in-a-matrix/description/
 *
 * algorithms
 * Easy (78.20%)
 * Likes:    222
 * Dislikes: 332
 * Total Accepted:    32.4K
 * Total Submissions: 41.4K
 * Testcase Example:  '2\n3\n[[0,1],[1,1]]'
 *
 * Given n and m which are the dimensions of a matrix initialized by zeros and
 * given an array indices where indices[i] = [ri, ci]. For each pair of [ri,
 * ci] you have to increment all cells in row ri and column ci by 1.
 * 
 * Return the number of cells with odd values in the matrix after applying the
 * increment to all indices.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: n = 2, m = 3, indices = [[0,1],[1,1]]
 * Output: 6
 * Explanation: Initial matrix = [[0,0,0],[0,0,0]].
 * After applying first increment it becomes [[1,2,1],[0,1,0]].
 * The final matrix will be [[1,3,1],[1,3,1]] which contains 6 odd numbers.
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: n = 2, m = 2, indices = [[1,1],[0,0]]
 * Output: 0
 * Explanation: Final matrix = [[2,2],[2,2]]. There is no odd number in the
 * final matrix.
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * 1 <= n <= 50
 * 1 <= m <= 50
 * 1 <= indices.length <= 100
 * 0 <= indices[i][0] < n
 * 0 <= indices[i][1] < m
 * 
 * 
 */

// @lc code=start
class Solution {
    public int oddCells(int n, int m, int[][] indices) {
        boolean[] oddRows = new boolean[n];
        boolean[] oddCols = new boolean[m];

        for (int[] index : indices) {
            oddRows[index[0]] ^= true;
            oddCols[index[1]] ^= true;
        }

        int count = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                count += oddRows[i] ^ oddCols[j] ? 1 : 0;
            }
        }

        return count;
    }
}
// @lc code=end

