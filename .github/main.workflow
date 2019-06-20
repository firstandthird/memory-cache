workflow "build and test" {
  on = "push"
  resolves = [
    "test",
    "build",
    "lint",
  ]
}

action "lint" {
  uses = "actions/npm@master"
  args = "lint"
}

action "build" {
  uses = "actions/npm@master"
  args = "install"
}

action "test" {
  needs = [
    "build",
    "lint",
  ]
  uses = "actions/npm@master"
  args = "test"
}
