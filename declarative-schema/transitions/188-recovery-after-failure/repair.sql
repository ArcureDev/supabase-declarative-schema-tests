update public.recovery_after_failure_guard
set required_later = 'repaired after expected failure'
where required_later is null;
