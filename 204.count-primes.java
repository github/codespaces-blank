/*
 * @lc app=leetcode id=204 lang=java
 *
 * [204] Count Primes
 *
 * https://leetcode.com/problems/count-primes/description/
 *
 * algorithms
 * Easy (28.14%)
 * Total Accepted:    221.5K
 * Total Submissions: 777.1K
 * Testcase Example:  '10'
 *
 * Count the number of prime numbers less than a non-negative number, n.
 * 
 * Example:
 * 
 * 
 * Input: 10
 * Output: 4
 * Explanation: There are 4 prime numbers less than 10, they are 2, 3, 5, 7.
 * 
 * 
 */
class Solution {
    public int countPrimes(int n) {
        boolean[] isMultipleOfPrime = new boolean[n];
        int count = 0;
        for (int i = 2; i < n; i++) {
            if (!isMultipleOfPrime[i]) {
                count++;
            }
            for (int j = i; j < n; j = j + i) {
                isMultipleOfPrime[j] = true;
            }
        }
        return count;
    }
}

