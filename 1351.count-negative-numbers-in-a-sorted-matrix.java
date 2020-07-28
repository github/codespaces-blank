/*
 * @lc app=leetcode id=1351 lang=java
 *
 * [1351] Count Negative Numbers in a Sorted Matrix
 *
 * https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/description/
 *
 * algorithms
 * Easy (76.66%)
 * Likes:    421
 * Dislikes: 26
 * Total Accepted:    54.8K
 * Total Submissions: 71.6K
 * Testcase Example:  '[[4,3,2,-1],[3,2,1,-1],[1,1,-1,-2],[-1,-1,-2,-3]]'
 *
 * Given a m * n matrix grid which is sorted in non-increasing order both
 * row-wise and column-wise. 
 * 
 * Return the number of negative numbers in grid.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: grid = [[4,3,2,-1],[3,2,1,-1],[1,1,-1,-2],[-1,-1,-2,-3]]
 * Output: 8
 * Explanation: There are 8 negatives number in the matrix.
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: grid = [[3,2],[1,0]]
 * Output: 0
 * 
 * 
 * Example 3:
 * 
 * 
 * Input: grid = [[1,-1],[-1,-1]]
 * Output: 3
 * 
 * 
 * Example 4:
 * 
 * 
 * Input: grid = [[-1]]
 * Output: 1
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * m == grid.length
 * n == grid[i].length
 * 1 <= m, n <= 100
 * -100 <= grid[i][j] <= 100
 * 
 */

// @lc code=start
// class Solution {
//     public int countNegatives(int[][] grid) {
//         if (grid == null || grid[0].length == 0) {
//             return 0;
//         }
        
//         int rows = grid.length;
//         int cols = grid[0].length;
        
//         int nums = 0;
//         for (int i = 0; i < rows; i++) {
//             for (int j = 0; j < cols; j++) {
//                 if (grid[i][j] < 0) {
//                     nums += cols - j;
//                     break;
//                 }
//             }
//         }
        
//         return nums;
//     }
// }

// https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/discuss/510249/JavaPython-3-2-similar-O(m-%2B-n)-codes-w-brief-explanation-and-analysis.
// Start from bottom-left corner of the matrix, count in the negative numbers in each row.
// Similarly, you can also start from top-right corner, whichever you feel comfortable with, count in the negative numbers in each column.
class Solution {
    public int countNegatives(int[][] grid) {
        if (grid == null || grid[0].length == 0) {
            return 0;
        }
        
        int rows = grid.length;
        int cols = grid[0].length;
        int currentRowIndex = rows - 1;
        int currentColIndex = 0;
        int nums = 0;

        while (currentRowIndex >= 0 && currentColIndex < cols) {
            if (grid[currentRowIndex][currentColIndex] < 0) {
                nums += cols - currentColIndex;
                currentRowIndex--;
            } else {
                currentColIndex++;
            }
        }
        
        return nums;
    }
}
// @lc code=end

