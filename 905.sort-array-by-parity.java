/*
 * @lc app=leetcode id=905 lang=java
 *
 * [905] Sort Array By Parity
 *
 * https://leetcode.com/problems/sort-array-by-parity/description/
 *
 * algorithms
 * Easy (72.62%)
 * Likes:    491
 * Dislikes: 54
 * Total Accepted:    107.3K
 * Total Submissions: 147.8K
 * Testcase Example:  '[3,1,2,4]'
 *
 * Given an array A of non-negative integers, return an array consisting of all
 * the even elements of A, followed by all the odd elements of A.
 * 
 * You may return any answer array that satisfies this condition.
 * 
 * 
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: [3,1,2,4]
 * Output: [2,4,3,1]
 * The outputs [4,2,3,1], [2,4,1,3], and [4,2,1,3] would also be accepted.
 * 
 * 
 * 
 * 
 * Note:
 * 
 * 
 * 1 <= A.length <= 5000
 * 0 <= A[i] <= 5000
 * 
 * 
 * 
 */
// two pointers
class Solution {
    public int[] sortArrayByParity(int[] A) {
        if (A == null || A.length < 2) {
            return A;
        }
        int left = 0;
        int right = A.length - 1;
        while (left < right) {
            while (A[left] % 2 == 0 && left < right) {
                left++;
            }
            while (A[right] % 2 == 1 && right > left) {
                right--;
            }
            if (left < right) {
                swap(A, left, right);
                left++;
                right--;
            } else {
                break;
            }
        }
        return A;
    }

    private void swap(int[]A, int left, int right) {
        int temp = A[left];
        A[left] = A[right];
        A[right] = temp;
    }
}


// More concise two pointers
class Solution {
    public int[] sortArrayByParity(int[] A) {
        if (A == null || A.length < 2) {
            return A;
        }

        int left = 0;
        int right = A.length - 1;
        while (left < right) {
            if (A[left] % 2 > A[right] % 2) {
                int temp = A[left];
                A[left] = A[right];
                A[right] = temp;
            }

            if (A[left] % 2 == 0) {
                left++;
            }
            if (A[right] % 2 == 1) {
                right--;
            }
        }

        return A;
    }
}

// Two Pass
// write all even number first, then write all odd numbers
class Solution {
    public int[] sortArrayByParity(int[] A) {
        if (A == null || A.length < 2) {
            return A;
        }

        int[] result = new int[A.length];
        int index = 0;

        for (int i = 0; i < A.length; i++) {
            if (A[i] % 2 == 0) {
                result[index++] = A[i];
            }
        }

        for (int i = 0; i < A.length; i++) {
            if (A[i] % 2 == 1) {
                result[index++] = A[i];
            }
        }

        return result;
    }
}

