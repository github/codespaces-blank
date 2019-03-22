/*
 * @lc app=leetcode id=252 lang=java
 *
 * [252] Meeting Rooms
 *
 * https://leetcode.com/problems/meeting-rooms/description/
 *
 * algorithms
 * Easy (51.27%)
 * Total Accepted:    77.1K
 * Total Submissions: 149.6K
 * Testcase Example:  '[[0,30],[5,10],[15,20]]'
 *
 * Given an array of meeting time intervals consisting of start and end times
 * [[s1,e1],[s2,e2],...] (si < ei), determine if a person could attend all
 * meetings.
 * 
 * Example 1:
 * 
 * 
 * Input: [[0,30],[5,10],[15,20]]
 * Output: false
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: [[7,10],[2,4]]
 * Output: true
 * 
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
    public boolean canAttendMeetings(Interval[] intervals) {
        if (intervals == null || intervals.length < 2) {
            return true;
        }
        // TreeMap is sorted by key, by default in increasing order
        TreeMap<Integer, Integer> map = new TreeMap<>();
        for (Interval interval : intervals) {
            // [[8,11],[17,20],[17,20]]
            // avaoid two same slot, if not check, the second one will override the first one
            if (!map.containsKey(interval.start)) {
                map.put(interval.start, interval.end);
            } else {
                return false;
            }
        }
        int prev = 0;
        for (Map.Entry<Integer, Integer> entry : map.entrySet()) {
            if (prev > entry.getKey()) {
                return false;
            }
            prev = entry.getValue();
        }
        return true;
    }
}

