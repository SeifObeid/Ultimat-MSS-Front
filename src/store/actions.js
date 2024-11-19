export default {
    removeBranch: (context, branch) => {
    context.commit("REMOVE_BRANCH", branch)
  },
}