/*
 * @lc app=leetcode id=118 lang=java
 *
 * [118] Pascal's Triangle
 *
 * https://leetcode.com/problems/pascals-triangle/description/
 *
 * algorithms
 * Easy (44.45%)
 * Total Accepted:    229.2K
 * Total Submissions: 514K
 * Testcase Example:  '5'
 *
 * Given a non-negative integer numRows, generate the first numRows of Pascal's
 * triangle.
 * 
 * 
 * In Pascal's triangle, each number is the sum of the two numbers directly
 * above it.
 * 
 * Example:
 * 
 * 
 * Input: 5
 * Output:
 * [
 * ⁠    [1],
 * ⁠   [1,1],
 * ⁠  [1,2,1],
 * ⁠ [1,3,3,1],
 * ⁠[1,4,6,4,1]
 * ]
 * 
 * 
 */
/** 
 * Basically pre holds the previous array, so if the index is neither first or last, the index value is going to be pre.get(j-1) + pre.get(j)
 */
// class Solution {
//     // iterative
//     public List<List<Integer>> generate(int numRows) {
//         List<List<Integer>> result = new ArrayList<List<Integer>>();
//         ArrayList<Integer> row = new ArrayList<>();
//         for (int i = 0; i < numRows; i++) {
//             row.add(0, 1);
//             for (int j = 1; j < row.size() - 1; j++) {
//                 row.set(j, row.get(j) + row.get(j + 1));
//             }
//             result.add(new ArrayList<Integer>(row));
//         }
//         return result;
//     }
// }

// http://www.javawithus.com/programs/pascal-triangle
class Solution {
    // recursive
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> result = new ArrayList<List<Integer>>();
        for (int i = 0; i < numRows; i++) {
            ArrayList<Integer> row = new ArrayList<>();
            for (int j = 0; j <= i; j++) {
                row.add(pascal(i, j));
            }
            result.add(new ArrayList<Integer>(row));
        }
        return result;
    }

    private int pascal(int i, int j) {
        // base case
        if (i == 0 || j == 0 || j == i) {
            return 1;
        }

        // recursive role
        return pascal(i - 1, j - 1) + pascal(i - 1, j);
    }
}

