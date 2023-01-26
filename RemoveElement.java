class RemoveElement {
    private static int remove(int[] arr, int target) {
        if (arr == null || arr.length == 0) {
            return 0;
        }

        int index = 0;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] != target) {
                arr[index] = arr[i];
                index++;
            }
        }

        return index;
    }
    
    public static void main(String[] args) {
        int[] arr = new int[] { 3, 2, 3, 6, 3, 10, 9, 3 };
        System.out.println(RemoveElement.remove(arr, 3));
    
        arr = new int[] { 2, 11, 2, 2, 1 };
        System.out.println(RemoveElement.remove(arr, 2));

        arr = null;
        System.out.println(RemoveElement.remove(arr, 2));

        arr = new int[] { };
        System.out.println(RemoveElement.remove(arr, 2));

        arr = new int[] { 1 };
        System.out.println(RemoveElement.remove(arr, 2));

        arr = new int[] { 1 };
        System.out.println(RemoveElement.remove(arr, 1));
    }
}
