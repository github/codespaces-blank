/*
 * @lc app=leetcode id=56 lang=java
 *
 * [56] Merge Intervals
 *
 * https://leetcode.com/problems/merge-intervals/description/
 *
 * algorithms
 * Medium (34.76%)
 * Total Accepted:    319.8K
 * Total Submissions: 910.5K
 * Testcase Example:  '[[1,3],[2,6],[8,10],[15,18]]'
 *
 * Given a collection of intervals, merge all overlapping intervals.
 * 
 * Example 1:
 * 
 * 
 * Input: [[1,3],[2,6],[8,10],[15,18]]
 * Output: [[1,6],[8,10],[15,18]]
 * Explanation: Since intervals [1,3] and [2,6] overlaps, merge them into
 * [1,6].
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: [[1,4],[4,5]]
 * Output: [[1,5]]
 * Explanation: Intervals [1,4] and [4,5] are considered overlapping.
 * 
 */
/**
 * Definition for an interval.
 * public class Interval {
 *     int start;
 *     int end;
 *     Interval() { start = 0; end = 0; }
 *     Interval(int s, int e) { start = s; end = e; }
 * }
 */
class Solution {
    public List<Interval> merge(List<Interval> intervals) {
         Collections.sort(intervals, new Comparator<Interval>(){
            @Override
            public int compare(Interval in1, Interval in2) {
                return in1.start - in2.start; 
            }
         });
         List<Interval> result = new ArrayList<>();
         Interval prev = null;
         for (Interval inter : intervals) {
             if (prev == null || inter.start > prev.end) {
                 result.add(inter);
                 prev = inter;
             } else if (inter.end > prev.end) {  // overlap
                // in this condition, we need to update end
                // if inter.end < prev.end, we dont need to update
                 prev.end = inter.end;
             }
         }
         return result;
    }
}

class Solution {
    public List<Interval> merge(List<Interval> intervals) {
        int n = intervals.size();
        int[] starts = new int[n];
        int[] ends = new int[n];
        for (int i = 0; i < n; i++) {
            starts[i] = intervals.get(i).start;
            ends[i] = intervals.get(i).end;
        }
        Arrays.sort(starts);
        Arrays.sort(ends);
        List<Interval> result = new ArrayList<>();
        for (int i = 0, j = 0; i < n; i++) {
            if (i == n - 1 || starts[i + 1] > ends[i]) {
                result.add(new Interval(starts[j], ends[i]));
                j = i + 1;
            }
        }
        return result;
    }
}

