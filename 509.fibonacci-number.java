/*
 * @lc app=leetcode id=509 lang=java
 *
 * [509] Fibonacci Number
 *
 * https://leetcode.com/problems/fibonacci-number/description/
 *
 * algorithms
 * Easy (66.50%)
 * Total Accepted:    24.5K
 * Total Submissions: 36.8K
 * Testcase Example:  '2'
 *
 * The Fibonacci numbers, commonly denoted F(n) form a sequence, called the
 * Fibonacci sequence, such that each number is the sum of the two preceding
 * ones, starting from 0 and 1. That is,
 * 
 * 
 * F(0) = 0,   F(1) = 1
 * F(N) = F(N - 1) + F(N - 2), for N > 1.
 * 
 * 
 * Given N, calculate F(N).
 * 
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: 2
 * Output: 1
 * Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1.
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: 3
 * Output: 2
 * Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2.
 * 
 * 
 * Example 3:
 * 
 * 
 * Input: 4
 * Output: 3
 * Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3.
 * 
 * 
 * 
 * 
 * Note:
 * 
 * 0 ≤ N ≤ 30.
 * 
 */

// Recursive
// Time complexity: O(n^2)
// Space complexity: O(n)
// class Solution {
//     public int fib(int N) {
//         if (N == 0) {
//             return 0;
//         } else if (N == 1) {
//             return 1;
//         }
//         return fib(N - 1) + fib(N - 2);
//     }
// }

// Iterative
// Time complexity: O(n^2)
// Space complexity: O(n)
// class Solution {
//     public int fib(int N) {
//         if (N <= 1) {
//             return N;
//         }
//         int a = 0;
//         int b = 1;
//         while (N > 1) {
//             int sum = a + b;
//             a = b;
//             b = sum;
//             N--;
//         }
//         return b;
//     }
// }

// DP - Top Down Approach
// Time complexity: O(n)
// Space complexity: O(n)
// class Solution {
//     int[] fib = new int[31];

//     public int fib(int N) {
//         if (N <= 1) {
//             return N;
//         } else if (fib[N] != 0) {
//             return fib[N];
//         } else {
//             return fib[N] = fib(N - 1) + fib(N - 2);
//         }
//     }
// }

// DP - Bottom Up Approach
// Time complexity: O(n)
// Space complexity: O(n)
class Solution {
    public int fib(int N) {
        if (N <= 1) {
            return N;
        }
        int[] fib = new int[N + 1];
        fib[1] = 1;
        for (int i = 2; i <= N; i++) {
            fib[i] = fib[i - 1] + fib[i - 2];
        }
        return fib[N];
    }
}
