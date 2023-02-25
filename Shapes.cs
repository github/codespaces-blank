using System;
using Shapes;

namespace Shapes {
    public class Cuboid {
        private double length;
        private double breadth;
        private double height;
        public Cuboid(double l, double b, double h) {
            this.length = l;
            this.breadth = b;
            this.height = h;
        }

        public double TotalSurfaceArea() {
            return 2*(length*breadth + breadth*height + height*length);
        }
        public double LateralSurfaceArea() {
            return 2*(length + breadth)*height;
        }
        public double Volume() {
            return length*breadth*height;
        }
        public double LengthofDiagonal() {
            return Math.Sqrt(length*length + breadth*breadth + height*height);
        }
        
        public void Execute() {
            Console.WriteLine("Total Surface Area: {0}", TotalSurfaceArea());
            Console.WriteLine("Lateral Surface Area: {0}", LateralSurfaceArea());
            Console.WriteLine("Volume: {0}", Volume());
            Console.WriteLine("Length of Diagonal: {0}", LengthofDiagonal());
            return;
        }
    };
    
    public class Cube{
        private double side;
        public Cube(double side) {
            this.side = side;
        }
        public double TotalSurfaceArea() {
            return 6* side*side;
        }
        public double LateralSurfaceArea() {
            return 4* side*side;
        }
        public double Volume() {
            return Math.Pow(side, 3);
        }
        public double LengthofDiagonal() {
            return side* 1.732;
        }
        public void Execute() {
            Console.WriteLine("Total Surface Area: {0}", TotalSurfaceArea());
            Console.WriteLine("Lateral Surface Area: {0}", LateralSurfaceArea());
            Console.WriteLine("Volume: {0}", Volume());
            Console.WriteLine("Length of Diagonal: {0}", LengthofDiagonal());
            return;
        }
    };
    
    public class Cylinder{
        private double radius;
        private double heig;
        public Cylinder(double radius, double heig) {
            this.radius = radius;
            this.heig = heig;
        }
        public double TotalSurfaceArea() {
            return 2*22/7* radius *(radius + heig);
        }
        public double CurvedSurfaceArea() {
            return 2*22/7* radius *heig;
        }
        public double Volume() {
            return 22/7* Math.Pow(radius, 2)* heig;
        }
        public void Execute() {
            Console.WriteLine("Total Surface Area: {0}", TotalSurfaceArea());
            Console.WriteLine("Curved Surface Area: {0}", CurvedSurfaceArea());
            Console.WriteLine("Volume: {0}", Volume());
            return;
        }
    };
    
    public class Sphere{
        private double rad;
        public Sphere(double rad) {
            this.rad = rad;
        }
        public double Volume() {
            return 4/3 * 22/7* Math.Pow(rad,3);
        }
        public double SurfaceArea() {
            return 4* 22/7 *rad*rad;
        }
        public void Execute() {
            Console.WriteLine("Surface Area: {0}", SurfaceArea());
            Console.WriteLine("Volume: {0}", Volume());
            return;
        }
    };
}
namespace Execution{
    class mainClass{
        public void Executor() {
            while(true) {
                Console.WriteLine("Select one:\n1.Sphere\n2.Cube\n3.Cuboid\n4.Cylinder\n5.Exit");
                Console.WriteLine("Enter your choice(1-4): ");
                int choice= int.Parse(Console.ReadLine() ?? "5");
                Console.WriteLine("\n");
                if (choice == 1) {
                    int radius = int.Parse(Console.ReadLine() ?? "0");
                    Sphere mySphere = new Sphere(radius);
                    mySphere.Execute();
                }
                else if (choice == 2) {
                    int sides = int.Parse(Console.ReadLine() ?? "0");
                    Cube mycube = new Cube(sides);
                    mycube.Execute();
                }
                else if (choice == 3) {
                    int length = int.Parse(Console.ReadLine() ?? "0");
                    int breadth= int.Parse(Console.ReadLine() ?? "0");
                    int height = int.Parse(Console.ReadLine() ?? "0");
                    Cuboid mycuboid = new Cuboid(length, breadth, height);
                    mycuboid.Execute();
                }
                else if (choice == 4) {
                    int radii = int.Parse(Console.ReadLine() ?? "0");
                    int heigh = int.Parse(Console.ReadLine() ?? "0");
                    Cylinder mycylinder = new Cylinder(radii, heigh);
                    mycylinder.Execute();
                }
                else if (choice == 5) {
                    break;
                }
                else {
                    Console.WriteLine("Invalid choice");
                }
                Console.WriteLine("\nDo you want to continue[Yn]: ");
                string cont= Console.ReadLine();
                if (cont== "n" || cont== "N") {
                    break;
                }
            }
        }
        static void Main(String[] args) {
            mainClass exec= new mainClass();
            exec.Executor();
        }
    }
}