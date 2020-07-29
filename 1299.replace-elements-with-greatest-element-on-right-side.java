/*
 * @lc app=leetcode id=1299 lang=java
 *
 * [1299] Replace Elements with Greatest Element on Right Side
 *
 * https://leetcode.com/problems/replace-elements-with-greatest-element-on-right-side/description/
 *
 * algorithms
 * Easy (75.81%)
 * Likes:    387
 * Dislikes: 90
 * Total Accepted:    59.5K
 * Total Submissions: 78.5K
 * Testcase Example:  '[17,18,5,4,6,1]'
 *
 * Given an array arr, replace every element in that array with the greatest
 * element among the elements to its right, and replace the last element with
 * -1.
 * 
 * After doing so, return the array.
 * 
 * 
 * Example 1:
 * Input: arr = [17,18,5,4,6,1]
 * Output: [18,6,6,6,1,-1]
 * 
 * 
 * Constraints:
 * 
 * 
 * 1 <= arr.length <= 10^4
 * 1 <= arr[i] <= 10^5
 * 
 */

// @lc code=start
class Solution {
    public int[] replaceElements(int[] arr) {
        if (arr == null || arr.length == 0) {
            return new int[0];
        }
        
        for (int i = 0; i < arr.length - 1; i++) {
            arr[i] = findGreatest(arr, i + 1);
        }
        
        arr[arr.length - 1] = -1;
        
        return arr;
    }
    
    private int findGreatest(int[] arr, int index) {
        int result = Integer.MIN_VALUE;
        
        for (int i = index; i < arr.length; i++) {
            if (arr[i] > result) {
                result = arr[i];
            }
        }
        
        return result;
    }
}

class Solution {
    public int[] replaceElements(int[] arr) {
        if (arr == null || arr.length == 0) {
            return new int[0];
        }
        
        // 不需要check数组只有一个值的时候，
        // int i = arr.length -2 < 0, for循环根本不会执行。不会报错
        // if (arr.length == 1) {
        //     return arr;
        // }
        
        // from right to left;
        int max = arr[arr.length - 1];
        for (int i = arr.length - 2; i >= 0; i--) {
            int currentValue = arr[i];
            arr[i] = max;
            if (max < currentValue) {
                max = currentValue;
            }
        }
        
        arr[arr.length - 1] = -1;
        
        return arr;
    }
}

// Simple Version 
// dont need to treat the last element separately 
class Solution {
    public int[] replaceElements(int[] arr) {
        if (arr == null || arr.length == 0) {
            return new int[0];
        }
        
        for (int i = arr.length - 1, max = -1; i >= 0; i--) {
            max = Math.max(arr[i], arr[i] = max);
        }
        
        return arr;
    }
}
// @lc code=end

