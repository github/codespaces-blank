/*
 * @lc app=leetcode id=566 lang=java
 *
 * [566] Reshape the Matrix
 *
 * https://leetcode.com/problems/reshape-the-matrix/description/
 *
 * algorithms
 * Easy (59.29%)
 * Likes:    618
 * Dislikes: 91
 * Total Accepted:    84.1K
 * Total Submissions: 141.9K
 * Testcase Example:  '[[1,2],[3,4]]\n1\n4'
 *
 * In MATLAB, there is a very useful function called 'reshape', which can
 * reshape a matrix into a new one with different size but keep its original
 * data.
 * 
 * 
 * 
 * You're given a matrix represented by a two-dimensional array, and two
 * positive integers r and c representing the row number and column number of
 * the wanted reshaped matrix, respectively.
 * 
 * ⁠The reshaped matrix need to be filled with all the elements of the original
 * matrix in the same row-traversing order as they were.
 * 
 * 
 * 
 * If the 'reshape' operation with given parameters is possible and legal,
 * output the new reshaped matrix; Otherwise, output the original matrix.
 * 
 * 
 * Example 1:
 * 
 * Input: 
 * nums = 
 * [[1,2],
 * ⁠[3,4]]
 * r = 1, c = 4
 * Output: 
 * [[1,2,3,4]]
 * Explanation:The row-traversing of nums is [1,2,3,4]. The new reshaped matrix
 * is a 1 * 4 matrix, fill it row by row by using the previous list.
 * 
 * 
 * 
 * Example 2:
 * 
 * Input: 
 * nums = 
 * [[1,2],
 * ⁠[3,4]]
 * r = 2, c = 4
 * Output: 
 * [[1,2],
 * ⁠[3,4]]
 * Explanation:There is no way to reshape a 2 * 2 matrix to a 2 * 4 matrix. So
 * output the original matrix.
 * 
 * 
 * 
 * Note:
 * 
 * The height and width of the given matrix is in range [1, 100].
 * The given r and c are all positive.
 * 
 * 
 */

 // Method 1: Queue
 // put all elements into a queue and move to the new array
// class Solution {
//     public int[][] matrixReshape(int[][] nums, int r, int c) {
//         int[][] result = new int[r][c];
//         if (nums.length == 0 || r * c != nums.length * nums[0].length) {
//             return nums;
//         }
//         Queue<Integer> queue = new LinkedList<>();
//         for (int i = 0; i < nums.length; i++) {
//             for (int j = 0; j < nums[0].length; j++) {
//                 queue.add(nums[i][j]);
//             }
//         }
//         for (int i = 0; i < r; i++) {
//             for (int j = 0; j < c; j++) {
//                 result[i][j] = queue.remove();
//             }
//         }
//         return result;
//     }
// }

// Method 2: Directly read from original array and move to new array
class Solution {
    public int[][] matrixReshape(int[][] nums, int r, int c) {
        int[][] result = new int[r][c];
        if (nums.length == 0 || r * c != nums.length * nums[0].length) {
            return nums;
        }
        // index for new result array   
        int row = 0;
        int col = 0;
        for (int i = 0; i < nums.length; i++) {
            for (int j = 0; j < nums[0].length; j++) {
                result[row][col] = nums[i][j];
                col++;
                // adjust row and col
                if (col == c) {
                    row++;
                    col = 0;
                }
            }
        }
        return result;
    }
}

