/*
 * @lc app=leetcode id=922 lang=java
 *
 * [922] Sort Array By Parity II
 *
 * https://leetcode.com/problems/sort-array-by-parity-ii/description/
 *
 * algorithms
 * Easy (67.04%)
 * Likes:    307
 * Dislikes: 29
 * Total Accepted:    48.1K
 * Total Submissions: 71.8K
 * Testcase Example:  '[4,2,5,7]'
 *
 * Given an array A of non-negative integers, half of the integers in A are
 * odd, and half of the integers are even.
 * 
 * Sort the array so that whenever A[i] is odd, i is odd; and whenever A[i] is
 * even, i is even.
 * 
 * You may return any answer array that satisfies this condition.
 * 
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: [4,2,5,7]
 * Output: [4,5,2,7]
 * Explanation: [4,7,2,5], [2,5,4,7], [2,7,4,5] would also have been
 * accepted.
 * 
 * 
 * 
 * 
 * Note:
 * 
 * 
 * 2 <= A.length <= 20000
 * A.length % 2 == 0
 * 0 <= A[i] <= 1000
 * 
 * 
 * 
 * 
 * 
 */

 // Two Pass
 // First loop: find all even numbers and put them into position 0, 2, 4...
 // Second Loop: find all odd numbers and put them into position 1, 3, 5...
class Solution {
    public int[] sortArrayByParityII(int[] A) {
        if (A == null || A.length < 2) {
            return A;
        }

        int[] result = new int[A.length];
        int index = 0;
        for (int i = 0; i < A.length; i++) {
            if (A[i] % 2 == 0) {
                result[index] = A[i];
                index += 2;
            }
        }

        index = 1;
        for (int i = 0; i < A.length; i++) {
            if (A[i] % 2 == 1) {
                result[index] = A[i];
                index += 2;
            }
        }
        return result;
    }
}

// In place
// if we put even numbers in the right place, then odd numbers are in the right place as well
// start from left to right, find even number and put to the even place
class Solution {
    public int[] sortArrayByParityII(int[] A) {
        if (A == null || A.length < 2) {
            return A;
        }
        
        int right = 1;
        for (int left = 0; left < A.length; left += 2) {
            if (A[left] % 2 == 1) {
                while (A[right] % 2 == 1) {
                    right += 2;
                }
                
                // swap left and right
                int temp = A[left];
                A[left] = A[right];
                A[right] = temp;
            }
        }
        return A;
    }
}

