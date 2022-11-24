/*
 * @lc app=leetcode id=1523 lang=java
 *
 * [1523] Count Odd Numbers in an Interval Range
 *
 * https://leetcode.com/problems/count-odd-numbers-in-an-interval-range/description/
 *
 * algorithms
 * Easy (46.87%)
 * Likes:    1202
 * Dislikes: 84
 * Total Accepted:    159.1K
 * Total Submissions: 344.3K
 * Testcase Example:  '3\n7'
 *
 * Given two non-negative integers low and high. Return the count of odd
 * numbers between low and high (inclusive).
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: low = 3, high = 7
 * Output: 3
 * Explanation: The odd numbers between 3 and 7 are [3,5,7].
 * 
 * Example 2:
 * 
 * 
 * Input: low = 8, high = 10
 * Output: 1
 * Explanation: The odd numbers between 8 and 10 are [9].
 * 
 * 
 * Constraints:
 * 
 * 
 * 0 <= low <= high <= 10^9
 * 
 */

// @lc code=start

//Explanation
//the count of odd numbers between 1 and low - 1 is low / 2
//the count of odd numbers between 1 and high is (high + 1 ) / 2
//Complexity
//Time O(1)
//Space O(1)
class Solution {
    public int countOdds(int low, int high) {
        return (high + 1) / 2 - low / 2;
    }
}
// @lc code=end

/**
The same logic can easily be implemented in c++ as well.

Case 1: when the range starts and ends with an odd number.
for a small range, lets see how it looks like-
odd-even-odd-even-odd
[odd-even], [odd-even], [odd]

We see alternate odd and even numbers, and there is just one odd number at the end which does not have an even pair!

So, count of even numbers ==(nums/2), then there is just one extra odd number,
therefore, number of odd numbers= (nums/2) + 1

Now, Consider these cases-

Case 2: starting with odd ending with even
odd-even-odd-even
[odd-even], [odd-even]

Case 3: starting with even ending with odd
even-odd-even-odd
[even-odd], [even,odd]

In both the above cases,
count of odd==count of even== nums/2

Last Case
Case 4: starting with even ending with even
even-odd-even-odd-even
[even-odd], [even,odd], [even]

count of odd=nums/2 , which is similar to case 1 and here we have an extra even number instead of odd, so no need to add anything!

So in all cases except Case 1, the answer is nums/2!
*/
 public int countOdds(int low, int high) {
       int nums=high-low+1;  //counting total numbers in range
 
		if(low%2!=0 && high%2!=0)  
            return nums/2 + 1;
        
        else
		return nums/2;
    }