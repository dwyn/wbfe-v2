---
title: "Elixir v Rust"
publishedAt: "2024-02-19"
summary: "Notable differences; ¿pero por que no los dos?"
image: "/media/table-of-languages.jpg"
---

## Introduction

As a senior software engineer with a focus on systems design, choosing the right tool for the job often boils down to understanding the strengths and trade-offs between different languages. **Elixir** and **Rust** represent two very different paradigms—**Elixir** shines in fault-tolerant, distributed systems, while **Rust** excels in performance and memory safety. So, which one should you use? The real answer could be _¿por que no los dos?_ (Why not both?)

Let's break down the comparison from the lens of a systems developer, focusing on performance, concurrency, and safety. We'll also dive into three easy-to-grasp code examples to highlight key differences between the two.

## Performance: Rust’s Speed vs. Elixir’s Lightweight Processes

Rust is a systems-level language designed to maximize performance while maintaining memory safety without a garbage collector. If you're building a low-level application where speed is critical, such as in gaming engines or embedded systems, Rust will likely be your go-to.

Elixir, on the other hand, is built on top of the Erlang VM, which is known for its ability to handle thousands of lightweight processes simultaneously. Its performance comes not from raw speed but from its ability to handle massive concurrency with minimal overhead, making it ideal for web services and distributed applications.

### Example 1: Fibonacci Computation in Rust vs Elixir


---

In Rust, we’d compute Fibonacci numbers in a performance-optimized way:

```rust
// Rust: Recursive Fibonacci with explicit types and ownership
fn fib(n: u32) -> u32 {
    if n <= 1 {
        n
    } else {
        fib(n - 1) + fib(n - 2)
    }
}

fn main() {
    println!("Fibonacci of 10 is: {}", fib(10));
}
```

In Elixir, the same Fibonacci logic may look more elegant but runs slower due to the interpreted nature of the BEAM VM:

```elixir
# Elixir: Pattern matching and recursion in a simple way
defmodule Fibonacci do
  def fib(0), do: 0
  def fib(1), do: 1
  def fib(n), do: fib(n - 1) + fib(n - 2)
end

IO.puts("Fibonacci of 10 is: #{Fibonacci.fib(10)}")
```

Takeaway: Rust's performance is optimized with its memory-safe, low-level control, while Elixir’s simplicity and readability may appeal when raw speed isn’t the main factor.


## Concurrency: Elixir’s Processes vs. Rust’s Ownership Model
Concurrency is where Elixir truly shines. Leveraging the Erlang VM, Elixir can spawn thousands of processes and distribute work across multiple nodes seamlessly. Each process is isolated, meaning if one process crashes, it doesn’t bring down the entire system.

Rust, by contrast, uses its ownership and borrowing system to enforce memory safety, even when dealing with concurrency. While you need to be explicit about how memory is shared between threads, the result is efficient and safe concurrent code without data races.

### Example 2: Spawning Processes/Threads
Here’s an example of spawning concurrent processes in Elixir:

```elixir
# Elixir: Spawning processes is simple and lightweight
spawn(fn -> IO.puts("Hello from Elixir process") end)
spawn(fn -> IO.puts("Another process doing work") end)
```

In Rust, we would use threads with a more explicit approach to manage concurrency:

```rust
// Rust: Using threads for concurrency
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        println!("Hello from Rust thread");
    });

    handle.join().unwrap(); // Ensure the thread finishes
}
```

Takeaway: Elixir offers a far simpler and more intuitive approach to concurrency, while Rust gives you more control at the cost of verbosity. Elixir's fault-tolerance makes it ideal for distributed systems, whereas Rust is better suited for concurrent performance-critical applications.

## Safety and Memory Management: Rust’s Guarantees vs. Elixir’s Garbage Collection
Rust’s memory model ensures safety at compile time, reducing bugs like null pointer dereferences or data races. Its ownership model means developers must be mindful of how data is handled, but the trade-off is worth it for the safety guarantees.

Elixir, being a higher-level language, abstracts away memory management through garbage collection. This simplifies development but can introduce latency, especially in long-running applications with significant memory churn.

Example 3: Memory Management in Rust vs. Elixir
In Rust, you have explicit control over memory and resource cleanup:

```rust
// Rust: Ownership and memory safety
fn main() {
    let s = String::from("Hello, Rust!"); // Ownership of string
    println!("{}", s);
    // s is automatically dropped here, ensuring no memory leaks
}
```

In Elixir, memory management is handled behind the scenes:
```elixir
# Elixir: Memory management with garbage collection
message = "Hello, Elixir!"
IO.puts(message)
# No need to manually manage memory, garbage collection does the work
```

Takeaway: If memory safety and performance are top priorities, Rust’s ownership system is unparalleled. Elixir simplifies things by handling memory automatically, though at the cost of introducing some latency with garbage collection.
Conclusion
From a systems design perspective, both Elixir and Rust serve their respective niches incredibly well. If you're building distributed, fault-tolerant applications, Elixir's lightweight concurrency model is hard to beat. Rust, on the other hand, is ideal for performance-critical applications where memory safety is essential.

So, ¿por que no los dos? Use Elixir where you need fault tolerance and concurrency, and Rust when you need raw performance and fine-grained control over memory. By leveraging both tools for what they do best, you can build systems that are both scalable and robust.
