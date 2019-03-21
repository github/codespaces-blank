/*
 * @lc app=leetcode id=88 lang=java
 *
 * [88] Merge Sorted Array
 *
 * https://leetcode.com/problems/merge-sorted-array/description/
 *
 * algorithms
 * Easy (34.83%)
 * Total Accepted:    338.3K
 * Total Submissions: 965.3K
 * Testcase Example:  '[1,2,3,0,0,0]\n3\n[2,5,6]\n3'
 *
 * Given two sorted integer arrays nums1 and nums2, merge nums2 into nums1 as
 * one sorted array.
 * 
 * Note:
 * 
 * 
 * The number of elements initialized in nums1 and nums2 are m and n
 * respectively.
 * You may assume that nums1 has enough space (size that is greater or equal to
 * m + n) to hold additional elements from nums2.
 * 
 * 
 * Example:
 * 
 * 
 * Input:
 * nums1 = [1,2,3,0,0,0], m = 3
 * nums2 = [2,5,6],       n = 3
 * 
 * Output: [1,2,2,3,5,6]
 * 
 * 
 */
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int nums1Length = m - 1;
        int nums2Length = n - 1;
        int totalLength = m + n - 1;

        // from back to front
        // which one is large, settle it first
        // so that it is sorted from left to right
        while (nums1Length >= 0 || nums2Length >= 0) {
            if (nums1Length < 0) {
                nums1[totalLength--] = nums2[nums2Length--];
            } else if (nums2Length < 0) {
                nums1[totalLength--] = nums1[nums1Length--];
            } else if (nums1[nums1Length] > nums2[nums2Length]) {
                nums1[totalLength--] = nums1[nums1Length--];
            } else {
                nums1[totalLength--] = nums2[nums2Length--];
            }
        }
    }
}

