package com.facebook.react.bridge;

import java.util.concurrent.atomic.AtomicBoolean;

// <Even>

public final class OnceCallback implements Callback {

  private final Callback delegate;
  private final AtomicBoolean invoked = new AtomicBoolean();

  public OnceCallback(Callback delegate) {
    this.delegate = delegate;
  }

  @Override
  public void invoke(Object... args) {
    if (!invoked.getAndSet(true)) {
      delegate.invoke(args);
    }
  }
}
