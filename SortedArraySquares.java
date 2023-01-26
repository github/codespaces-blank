class SortedArraySquares {
    private static int[] makeSquares(int[] arr) {
        if (arr == null || arr.length < 1) {
            return arr;
        }
        int left = 0, right = arr.length - 1, index = arr.length - 1;
        int[] results = new int[arr.length];

        // must be left <= right
        // otherwise left < right for {1} returns 0
        while (left <= right) {
            if (Math.abs(arr[left]) >= Math.abs(arr[right])) {
                results[index] = arr[left] * arr[left];
                left++;
            } else {
                results[index] = arr[right] * arr[right];
                right--;
            }
            index--;
        }

        return results;
    }
    
    public static void main(String[] args) {
        int[] result = SortedArraySquares.makeSquares(new int[] { });
        for (int num : result)
            System.out.print(num + " ");
        System.out.println();

        result = SortedArraySquares.makeSquares(new int[] { 1 });
        for (int num : result)
            System.out.print(num + " ");
        System.out.println();

        result = SortedArraySquares.makeSquares(null);
        if (result == null)
            System.out.print("result array is null");
        System.out.println();

        result = SortedArraySquares.makeSquares(new int[] { -2, -1, 0, 2, 3 });
        for (int num : result)
            System.out.print(num + " ");
        System.out.println();
    
        result = SortedArraySquares.makeSquares(new int[] { -3, -1, 0, 1, 2 });
        for (int num : result)
            System.out.print(num + " ");
        System.out.println();
    }
}
