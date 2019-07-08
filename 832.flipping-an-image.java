/*
 * @lc app=leetcode id=832 lang=java
 *
 * [832] Flipping an Image
 *
 * https://leetcode.com/problems/flipping-an-image/description/
 *
 * algorithms
 * Easy (72.91%)
 * Likes:    529
 * Dislikes: 111
 * Total Accepted:    104.8K
 * Total Submissions: 143.8K
 * Testcase Example:  '[[1,1,0],[1,0,1],[0,0,0]]'
 *
 * Given a binary matrix A, we want to flip the image horizontally, then invert
 * it, and return the resulting image.
 * 
 * To flip an image horizontally means that each row of the image is reversed.
 * For example, flipping [1, 1, 0] horizontally results in [0, 1, 1].
 * 
 * To invert an image means that each 0 is replaced by 1, and each 1 is
 * replaced by 0. For example, inverting [0, 1, 1] results in [1, 0, 0].
 * 
 * Example 1:
 * 
 * 
 * Input: [[1,1,0],[1,0,1],[0,0,0]]
 * Output: [[1,0,0],[0,1,0],[1,1,1]]
 * Explanation: First reverse each row: [[0,1,1],[1,0,1],[0,0,0]].
 * Then, invert the image: [[1,0,0],[0,1,0],[1,1,1]]
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: [[1,1,0,0],[1,0,0,1],[0,1,1,1],[1,0,1,0]]
 * Output: [[1,1,0,0],[0,1,1,0],[0,0,0,1],[1,0,1,0]]
 * Explanation: First reverse each row:
 * [[0,0,1,1],[1,0,0,1],[1,1,1,0],[0,1,0,1]].
 * Then invert the image: [[1,1,0,0],[0,1,1,0],[0,0,0,1],[1,0,1,0]]
 * 
 * 
 * Notes:
 * 
 * 
 * 1 <= A.length = A[0].length <= 20
 * 0 <= A[i][j] <= 1
 * 
 * 
 */

class Solution {
    public int[][] flipAndInvertImage(int[][] A) {
        int rows = A.length;
        int columns = A[0].length;
        flipHorizontally(A, rows, columns);
        invert(A, rows, columns);
        return A;
    }

    public void flipHorizontally(int[][] A, int rows, int columns) {
        for (int i = 0; i < columns / 2; i++) {
            for (int j = 0; j < rows; j++) {
                swap(A, i, j, columns, rows);
            }
        }
    }

    public void invert(int[][] A, int rows, int columns) {
        for (int i = 0; i < columns; i++) {
            for (int j = 0; j < rows; j++) {
                A[j][i] ^= 1;
            }
        }
    }

    public void swap(int[][]A, int currentCol, int currentRow, int columns, int rows) {
        int temp = A[currentRow][currentCol];
        A[currentRow][currentCol] = A[currentRow][columns - currentCol - 1];
        A[currentRow][columns - currentCol - 1] = temp;
    }
}


// Solution 2: more concise
// in the concise version, we need to make sure we process the middle one.
// because we do flip and invert at the same time.
// so we use (columns + 1) / 2, to make sure we processed the middle one. otherwise
// columns / 2 failed.
class Solution {
    public int[][] flipAndInvertImage(int[][] A) {
        int rows = A.length;
        int columns = A[0].length;

        for (int j = 0; j < rows; j++) {
            // (columns + 1) / 2
            for (int i = 0; i < (columns + 1) / 2; i++) {
                int temp = A[j][i] ^ 1;
                A[j][i] = A[j][columns - i - 1] ^ 1;
                A[j][columns - i - 1] = temp;
            }
        }

        return A;
    }
}

