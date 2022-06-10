/*
 * @lc app=leetcode id=1720 lang=java
 *
 * [1720] Decode XORed Array
 *
 * https://leetcode.com/problems/decode-xored-array/description/
 *
 * algorithms
 * Easy (85.90%)
 * Likes:    796
 * Dislikes: 144
 * Total Accepted:    73.8K
 * Total Submissions: 85.9K
 * Testcase Example:  '[1,2,3]\n1'
 *
 * There is a hidden integer array arr that consists of n non-negative
 * integers.
 * 
 * It was encoded into another integer array encoded of length n - 1, such that
 * encoded[i] = arr[i] XOR arr[i + 1]. For example, if arr = [1,0,2,1], then
 * encoded = [1,2,3].
 * 
 * You are given the encoded array. You are also given an integer first, that
 * is the first element of arr, i.e. arr[0].
 * 
 * Return the original array arr. It can be proved that the answer exists and
 * is unique.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: encoded = [1,2,3], first = 1
 * Output: [1,0,2,1]
 * Explanation: If arr = [1,0,2,1], then first = 1 and encoded = [1 XOR 0, 0
 * XOR 2, 2 XOR 1] = [1,2,3]
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: encoded = [6,2,7,3], first = 4
 * Output: [4,2,0,7,4]
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * 2 <= n <= 10^4
 * encoded.length == n - 1
 * 0 <= encoded[i] <= 10^5
 * 0 <= first <= 10^5
 * 
 * 
 */

// @lc code=start
/**
 * The inverse is XOR!

If you have:

c = a^b;
You can get a or b back if you have the other value available:

a = c^b; // or b^c (order is not important)
b = c^a; // or a^c

encoded[i] = arr[i] ^ arr[i+1]

Here we have an encoded array, and we want a resultant array, so we can interchange

res[0] = first
res[i+1] = res[i] ^ encoded[i]
 */
class Solution {
    public int[] decode(int[] encoded, int first) {
        int[] result = new int[encoded.length + 1];
        result[0] = first;
        
        // because encoded.length = result.length - 1, 
        // so we use <= encoded.length here
        for (int i = 1; i <= encoded.length; i++) {
            result[i] = result[i - 1] ^ encoded[i - 1];
        }
        
        return result;
    }
}
// @lc code=end

